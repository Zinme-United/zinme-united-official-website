# Codebase Concerns

**Analysis Date:** 2026-05-01

## Tech Debt

**No Test Suite Whatsoever:**
- Issue: Zero test files exist anywhere in the codebase. The server `package.json` test script literally runs `echo "Error: no test specified" && exit 1`. No testing framework is installed on either client or server.
- Files: `server/package.json` (line 7), entire `client/src/` and `server/src/` directories
- Impact: Every change is a blind deployment. Regressions go undetected until users report them. Refactoring is high-risk.
- Fix approach: Install vitest for client (already uses Vite), install jest + supertest for server. Prioritize testing auth flows, CRUD controllers, and protected route middleware first.

**Server `dist/` Directory Committed to Git:**
- Issue: The compiled `server/dist/` directory is tracked by git. Build artifacts should never be committed.
- Files: `server/dist/*` (all compiled JS files are tracked)
- Impact: Bloats repository, causes merge conflicts on build output, creates confusion about source of truth.
- Fix approach: Add `dist` to the root `.gitignore`, then run `git rm -r --cached server/dist/`. The root `.gitignore` only has `.vercel`, `dist`, and `dist-ssr` but these only match at root level. The `server/.gitignore` does have `dist` but the files were committed before the gitignore was added.

**Root `.gitignore` is Incomplete:**
- Issue: The root `.gitignore` at project root only contains `.vercel`, `dist`, and `dist-ssr`. It does not ignore `node_modules`, `.env`, or `.DS_Store` at root level. The `.DS_Store` file is already tracked by git.
- Files: `.gitignore`
- Impact: Risk of accidentally committing sensitive files or large directories from root level. `.DS_Store` is already committed.
- Fix approach: Consolidate into a comprehensive root `.gitignore` that covers `node_modules`, `.env*`, `.DS_Store`, `dist/`, and build artifacts for both client and server.

**`react-redux` Listed as Server Dependency:**
- Issue: `react-redux` (v9.2.0) is listed in `server/package.json` dependencies. This is a React frontend library that has no place in a Node.js/Express backend.
- Files: `server/package.json` (line 27)
- Impact: Unnecessary dependency bloat on the server, confusing for developers.
- Fix approach: Remove `react-redux` from `server/package.json` dependencies.

**Duplicate Date Libraries:**
- Issue: Both `date-fns` and `dayjs` are installed as client dependencies. Only `date-fns` is actually imported anywhere in the codebase (`format` function). `dayjs` is unused.
- Files: `client/package.json` (lines for `date-fns` and `dayjs`)
- Impact: Unnecessary bundle size increase.
- Fix approach: Remove `dayjs` from `client/package.json`.

**Unused `react-icons` Dependency:**
- Issue: `react-icons` is installed but the only import is commented out in `client/src/pages/player-details/PlayerDetails.tsx`. The codebase exclusively uses `lucide-react` for icons (34 occurrences across 32 files).
- Files: `client/package.json`, `client/src/pages/player-details/PlayerDetails.tsx` (line 2)
- Impact: Unnecessary dependency. `react-icons` is a large package.
- Fix approach: Remove `react-icons` from `client/package.json` and delete the commented import.

**`notFound` Middleware Exported but Never Used:**
- Issue: The `notFound` middleware is defined and exported from `server/src/middleware/error.middleware.ts` but never imported or mounted in `server/src/app.ts`. Only `errorHandler` is used.
- Files: `server/src/middleware/error.middleware.ts` (line 4), `server/src/app.ts`
- Impact: Unknown routes return Express's default HTML error page instead of a consistent JSON error response.
- Fix approach: Add `app.use(notFound)` before `app.use(errorHandler)` in `server/src/app.ts`.

**Excessive `console.log` Statements in Production Code:**
- Issue: 22 `console.log/error/warn` calls in server code and 51 in client code. These include sensitive information like the MongoDB URI logged on server startup (`server/src/server.ts` line 14).
- Files: `server/src/server.ts` (line 14 logs MongoDB URI), `server/src/controllers/auth.controller.ts` (6 occurrences including reset tokens), all client hooks
- Impact: Leaks connection strings and reset tokens to server logs. Client console is noisy.
- Fix approach: Remove the MongoDB URI log. Replace console calls with a proper logging library (e.g., pino or winston) that supports log levels. Strip client console calls for production builds.

## Security Considerations

**No Rate Limiting:**
- Risk: Authentication endpoints (`/api/auth/login`, `/api/auth/register`, `/api/auth/forgotpassword`) have no rate limiting. An attacker can brute-force credentials or spam password reset requests.
- Files: `server/src/routes/auth.route.ts`, `server/src/app.ts`
- Current mitigation: None
- Recommendations: Install `express-rate-limit` and apply strict limits to auth routes (e.g., 5 login attempts per 15 minutes per IP).

**No Helmet or Security Headers:**
- Risk: The Express server does not use `helmet` or set any security headers. This leaves the API vulnerable to common web attacks (clickjacking, MIME sniffing, etc.).
- Files: `server/src/app.ts`
- Current mitigation: None
- Recommendations: Install and configure `helmet` as the first middleware in `server/src/app.ts`.

**Registration Endpoint Accepts Arbitrary Roles:**
- Risk: The `registerUser` controller accepts a `role` field from the request body (`req.body.role`). Any user can register as `admin` or `editor` by sending `{ "role": "admin" }` in the POST body.
- Files: `server/src/controllers/auth.controller.ts` (line 10, line 32-33)
- Current mitigation: None. The code explicitly uses `role: role || "public"`.
- Recommendations: Never accept `role` from the request body during public registration. Always force `role: "public"`. Admin/editor roles should only be assignable by existing admins through a separate endpoint.

**Forgot Password Returns Reset Token in API Response:**
- Risk: The `forgotPassword` endpoint returns the raw reset token directly in the HTTP response body (`devOnly.resetToken`). This is marked as "DEV ONLY" but there is no environment check to prevent this in production.
- Files: `server/src/controllers/auth.controller.ts` (lines 139-161)
- Current mitigation: Comments say "for development/testing only" but there is no `if (process.env.NODE_ENV !== 'production')` guard.
- Recommendations: Wrap the token exposure in an environment check. In production, send the token only via email using `nodemailer` (which is already installed but unused for this purpose).

**Player Image Upload Endpoint Has No Authentication:**
- Risk: `POST /api/players/upload-image` has no `protect` or `authorizeRoles` middleware. Anyone can upload images to the Cloudinary account without authentication.
- Files: `server/src/routes/player.route.ts` (lines 18-23)
- Current mitigation: None
- Recommendations: Add `protect, authorizeRoles("admin", "editor")` middleware before `uploadSingle` on the upload-image route, matching the pattern used for gallery and activity upload routes.

**`/api/auth/users` Endpoint Lacks Role Authorization:**
- Risk: The `getUsers` endpoint only requires authentication (`protect`) but does not check for admin role. Any authenticated user (including `public` role) can list all users.
- Files: `server/src/routes/auth.route.ts` (line 21), `server/src/controllers/auth.controller.ts` (lines 105-114)
- Current mitigation: None
- Recommendations: Add `authorizeRoles("admin")` to the `/users` route.

**JWT Token Hardcoded to 1-Hour Expiry:**
- Risk: The JWT expiry is hardcoded to `"1h"` in `server/src/utils/generateToken.ts` (line 8). The code checks for a `JWT_EXPIRES_IN` env var but then ignores it, always using the hardcoded value.
- Files: `server/src/utils/generateToken.ts` (lines 8-10)
- Current mitigation: Token is short-lived (1 hour), which is good for security, but there is no refresh token mechanism. Users must re-login every hour.
- Recommendations: Either implement a refresh token flow or make the expiry configurable via `JWT_EXPIRES_IN` env var. Consider using HTTP-only cookies instead of localStorage for token storage.

**Token Stored in localStorage:**
- Risk: JWT tokens are stored in `localStorage` via the Redux auth slice. localStorage is accessible to any JavaScript running on the page, making it vulnerable to XSS attacks.
- Files: `client/src/store/authSlice.ts` (lines 6-7, 20, 27)
- Current mitigation: None
- Recommendations: Use HTTP-only cookies for token storage. This requires server-side changes to set cookies on login and read them on subsequent requests.

**No Input Sanitization on Server:**
- Risk: Request body data is used directly in MongoDB queries and document creation without sanitization. While Mongoose schemas provide some validation, there is no protection against NoSQL injection via query operators.
- Files: All controllers in `server/src/controllers/`
- Current mitigation: Mongoose schema validation provides basic type checking.
- Recommendations: Install `express-mongo-sanitize` to strip MongoDB operators from request data. Add input validation middleware using a library like `joi` or `zod` on the server side.

**`Object.assign` Used for Updates Without Field Whitelisting:**
- Risk: `server/src/controllers/ourclub.controller.ts` uses `Object.assign(about, req.body)` which copies ALL fields from the request body onto the Mongoose document, including any fields an attacker might inject (e.g., `_id`, `createdAt`, `__v`).
- Files: `server/src/controllers/ourclub.controller.ts` (lines 89, 121)
- Current mitigation: Mongoose schema will reject unknown fields, but known fields can be overwritten.
- Recommendations: Destructure only expected fields from `req.body` before assigning, matching the pattern used in other controllers.

## Performance Bottlenecks

**No Pagination on Any Endpoint:**
- Problem: All list endpoints (`getPlayers`, `getNews`, `getActivities`, `getGalleries`, `getUsers`) return the entire collection with no pagination support.
- Files: All controllers in `server/src/controllers/` (every `find({})` call)
- Cause: No `skip`, `limit`, or cursor-based pagination implemented.
- Improvement path: Add `page` and `limit` query parameters to all list endpoints. Use `.skip((page - 1) * limit).limit(limit)` and return total count in response headers or body.

**No Database Indexes Beyond Defaults:**
- Problem: MongoDB models do not define indexes beyond the default `_id` and the unique constraints on `User.email` and `User.username`. Queries filtering by `type`, `date`, `isFeatured`, `tags`, etc. will perform collection scans.
- Files: `server/src/models/Activity.ts`, `server/src/models/News.ts`, `server/src/models/Gallery.ts`
- Cause: No compound or single-field indexes defined on commonly queried fields.
- Improvement path: Add indexes on fields used in query filters: `Activity.type`, `Activity.date`, `News.isFeatured`, `News.publishedAt`, `News.tags`, `Gallery.category`.

**All Images Stored in Memory Before Upload:**
- Problem: Multer uses `memoryStorage()`, meaning entire file buffers are held in Node.js memory before streaming to Cloudinary. With a 5MB limit per file and concurrent uploads, this can cause memory pressure.
- Files: `server/src/middleware/upload.middleware.ts` (line 5)
- Cause: Design choice for simplicity.
- Improvement path: For current scale this is acceptable, but if concurrent uploads increase, consider streaming directly to Cloudinary using `cloudinary.uploader.upload_stream` with disk-based temp storage instead of memory.

## Fragile Areas

**ProtectedRoute Component Has Broken Role Check:**
- Files: `client/src/components/ProtectedRoutes.tsx` (lines 24-26)
- Why fragile: The role authorization check on line 24 reads `if (allowedRoles && !allowedRoles.includes("admin"))` -- this checks if the string `"admin"` is in the `allowedRoles` array, NOT whether the current user's role is in `allowedRoles`. It never reads the user's actual role from state. Since all protected routes pass `allowedRoles={["admin"]}`, the condition `!allowedRoles.includes("admin")` is always `false`, so the redirect never triggers. This means ANY authenticated user (even `public` role) can access admin routes on the client side.
- Safe modification: Change to check `user.role` against `allowedRoles`: `if (allowedRoles && user && !allowedRoles.includes(user.role))`. Also need to read `user` from Redux state (currently only `token` is destructured).
- Test coverage: None

**Player Update Uses `||` Instead of `??` for Falsy Values:**
- Files: `server/src/controllers/player.controller.ts` (lines 152-159)
- Why fragile: Update fields use `name || player.name` pattern. If a field is intentionally set to `0`, `""`, or `false`, the update will be silently ignored because these are falsy. For example, setting a player's jersey `number` to `0` would fail.
- Safe modification: Use nullish coalescing (`??`) instead of logical OR (`||`) for all update fields. Some controllers (news, activity) already use `??` correctly for some fields but not all.
- Test coverage: None

**Cloudinary Public ID Extraction is Brittle:**
- Files: `server/src/controllers/player.controller.ts` (lines 212-214)
- Why fragile: The player delete handler extracts the Cloudinary public ID by splitting the URL string and reconstructing it with a hardcoded `"players/"` prefix. If Cloudinary URL format changes or the folder structure differs, this breaks silently (image orphaned in Cloudinary). Other controllers (news, gallery, activity) store `publicId` as a separate field, which is the correct approach.
- Safe modification: Add an `imgPublicId` field to the Player model and store it during creation, matching the pattern used by News, Gallery, and Activity models.
- Test coverage: None

**Database Connection Called at Module Import Time:**
- Files: `server/src/app.ts` (line 21)
- Why fragile: `connectDB()` is called at the top level of `app.ts` when the module loads. This makes the app module untestable in isolation (importing it immediately connects to MongoDB) and means any module import triggers a database connection attempt.
- Safe modification: Move `connectDB()` into `server.ts` before `app.listen()`, or make it lazy.
- Test coverage: None

## Dependencies at Risk

**`@types/mongoose` is Deprecated:**
- Risk: `@types/mongoose` (v5.11.96) is listed in server devDependencies. Since Mongoose v5.11+, types are bundled with Mongoose itself. This deprecated package may cause type conflicts.
- Files: `server/package.json`
- Impact: Potential type mismatches between the bundled Mongoose types and the separate `@types/mongoose` package.
- Migration plan: Remove `@types/mongoose` from devDependencies. Mongoose 8.x already includes its own TypeScript types.

**`nodemon` Listed as Production Dependency:**
- Risk: `nodemon` is in `dependencies` instead of `devDependencies` in the server package.
- Files: `server/package.json`
- Impact: Installed in production unnecessarily, increasing deployment size.
- Migration plan: Move `nodemon` to `devDependencies`.

**`ts-node` Listed as Production Dependency:**
- Risk: `ts-node` is in `dependencies` instead of `devDependencies` in the server package.
- Files: `server/package.json`
- Impact: Installed in production unnecessarily. Production runs compiled JS from `dist/`.
- Migration plan: Move `ts-node` to `devDependencies`.

## Missing Critical Features

**No Email Sending for Password Reset:**
- Problem: `nodemailer` is installed as a dependency but is never imported or used anywhere. The forgot password flow returns the reset token directly in the API response instead of emailing it.
- Files: `server/src/controllers/auth.controller.ts` (lines 116-163), `server/package.json` (nodemailer dependency)
- Blocks: Password reset cannot be used safely in production.

**No Token Refresh Mechanism:**
- Problem: JWT tokens expire after 1 hour with no way to refresh. Users are forced to re-login.
- Files: `server/src/utils/generateToken.ts`, `client/src/store/authSlice.ts`
- Blocks: Poor user experience for admin sessions that require extended work.

**No Request Body Size Limit:**
- Problem: `express.json()` is used without a size limit. An attacker could send extremely large JSON payloads to consume server memory.
- Files: `server/src/app.ts` (line 38)
- Blocks: Potential denial-of-service vector.

## Test Coverage Gaps

**Entire Codebase is Untested:**
- What's not tested: Everything -- authentication, authorization, CRUD operations, image uploads, client components, hooks, routing, state management.
- Files: All files in `server/src/` and `client/src/`
- Risk: Any code change could introduce regressions that go undetected. The broken `ProtectedRoute` role check (described above) is a direct consequence of no testing.
- Priority: High -- Start with server auth middleware, then CRUD controllers, then client auth flow and protected routes.

---

*Concerns audit: 2026-05-01*
