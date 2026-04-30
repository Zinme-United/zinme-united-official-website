# Architecture

**Analysis Date:** 2026-05-01

## Pattern Overview

**Overall:** Client-Server Monorepo with REST API

**Key Characteristics:**
- Separate `client/` (React SPA) and `server/` (Express API) directories in a single repository
- No shared workspace root `package.json` -- each app manages its own dependencies independently
- Server follows MVC pattern (Models, Controllers, Routes) with Express middleware pipeline
- Client uses a hooks-based data-fetching pattern (React Query) with Redux for auth state only
- Role-based access control (admin/editor/public) spans both client routing and server middleware

## Layers

**Client - Presentation Layer (Pages):**
- Purpose: Render full pages, compose components, handle page-level state
- Location: `client/src/pages/`
- Contains: One page component per subdirectory (e.g., `home/Home.tsx`, `players/Players.tsx`)
- Depends on: Components, Hooks, Types, Schemas
- Used by: Router in `client/src/App.tsx`

**Client - Component Layer:**
- Purpose: Reusable UI components (modals, cards, sections, forms)
- Location: `client/src/components/`
- Contains: Flat list of `.tsx` files, barrel-exported via `client/src/components/index.ts`
- Depends on: Hooks, Types, API layer, Store
- Used by: Pages

**Client - Data Hooks Layer:**
- Purpose: Encapsulate all API calls and server-state management using React Query
- Location: `client/src/hooks/`
- Contains: One hook per domain entity (`usePlayers.ts`, `useNews.ts`, `useGalleries.ts`, `useActivities.ts`, `useAuth.ts`, `useOurClub.ts`, `useGetPlayerById.ts`, `useGetGalleryById.ts`, `useSingleNews.ts`)
- Depends on: `client/src/api/axiosInstance.ts`, Types, Store (for auth token)
- Used by: Pages, Components

**Client - API Layer:**
- Purpose: Configure Axios instance with base URL and auth token interceptor
- Location: `client/src/api/axiosInstance.ts`
- Contains: Single Axios instance with request interceptor that injects Bearer token from Redux store
- Depends on: Store (reads `auth.token`)
- Used by: All hooks

**Client - State Layer (Redux):**
- Purpose: Manage authentication state only (user, token, isLoggedIn, role)
- Location: `client/src/store/`
- Contains: `index.ts` (store config), `authSlice.ts` (single slice)
- Depends on: Nothing (leaf dependency)
- Used by: API layer (token injection), ProtectedRoutes, AdminLayout, hooks

**Client - Validation Layer:**
- Purpose: Zod schemas for form validation via react-hook-form
- Location: `client/src/schemas/`
- Contains: One schema file per entity (`playerSchemas.ts`, `authSchemas.ts`, `gallerySchemas.ts`, `newsSchemas.ts`, `ourClubSchemas.ts`, `activitySchemas.ts`)
- Depends on: Zod
- Used by: Form components via `@hookform/resolvers`

**Server - Route Layer:**
- Purpose: Define Express routes and attach middleware/controller functions
- Location: `server/src/routes/`
- Contains: One file per resource (`player.route.ts`, `auth.route.ts`, `coach.route.ts`, `gallery.route.ts`, `activity.route.ts`, `news.route.ts`, `ourclub.route.ts`)
- Depends on: Controllers, Middleware
- Used by: `server/src/app.ts` (mounted under `/api/` prefix)

**Server - Controller Layer:**
- Purpose: Handle request/response logic, call models, return JSON
- Location: `server/src/controllers/`
- Contains: One file per resource (`player.controller.ts`, `auth.controller.ts`, `coach.controller.ts`, `gallery.controller.ts`, `news.controller.ts`, `ourclub.controller.ts`, `activity.controller.ts`)
- Depends on: Models, Utils (`uploadImage`, `generateToken`), `express-async-handler`
- Used by: Routes

**Server - Model Layer:**
- Purpose: Define Mongoose schemas and models
- Location: `server/src/models/`
- Contains: `Player.ts`, `User.ts`, `Coach.ts`, `Gallery.ts`, `News.ts`, `OurClub.ts`, `Activity.ts`
- Depends on: Mongoose, Types
- Used by: Controllers

**Server - Middleware Layer:**
- Purpose: Cross-cutting concerns (auth, uploads, error handling, request logging)
- Location: `server/src/middleware/`
- Contains: `auth.middleware.ts` (JWT protect + role authorization), `upload.middleware.ts` (multer config), `error.middleware.ts` (global error handler), `requestLogger.ts`
- Depends on: Models (User), JWT
- Used by: Routes, App

## Data Flow

**Public Read (e.g., fetching players):**

1. React component calls `usePlayers()` hook
2. Hook uses React Query `useQuery` with `axiosInstance.get("/players")`
3. Axios interceptor attaches Bearer token if present (optional for public routes)
4. Express receives GET `/api/players`, routes to `getPlayers` controller
5. Controller calls `Player.find({})` on MongoDB via Mongoose
6. Response returns `{ status: true, message: "...", count: N, data: [...] }`
7. React Query caches response, hook exposes `players`, `playersLoading`, `playersError`

**Authenticated Write (e.g., creating a player):**

1. Admin form submits, page calls `uploadImage` mutation with FormData (image file)
2. Server receives multipart upload via multer middleware, uploads to Cloudinary
3. Server returns `{ imageUrl, publicId }`
4. Page then calls `createPlayer` mutation with player data including `imageUrl`
5. Express route applies `protect` (JWT verify) then `authorizeRoles("admin", "editor")`
6. Controller validates fields, creates Mongoose document, saves to MongoDB
7. React Query invalidates `["players"]` query key, triggering refetch

**Authentication Flow:**

1. User submits login form, `useAuth().login()` calls POST `/api/auth/login`
2. Server verifies credentials via `bcrypt.compare`, generates JWT with `{ id, role }` (1h expiry)
3. Client receives token, dispatches `setCredentials` to Redux store, stores token in `localStorage`
4. Axios interceptor reads token from Redux store for subsequent requests
5. On logout, Redux state clears and `localStorage.removeItem("token")`

**State Management:**
- **Server state:** React Query manages all server data (players, news, galleries, activities, club info). Each hook returns query/mutation objects.
- **Client state:** Redux Toolkit manages auth only (`authSlice`). Token persisted to `localStorage`.
- **Form state:** react-hook-form with Zod resolver handles form validation per entity.

## Key Abstractions

**Custom Hooks (Data Access):**
- Purpose: Encapsulate CRUD operations per domain entity
- Examples: `client/src/hooks/usePlayers.ts`, `client/src/hooks/useAuth.ts`, `client/src/hooks/useNews.ts`, `client/src/hooks/useGalleries.ts`, `client/src/hooks/useActivities.ts`, `client/src/hooks/useOurClub.ts`
- Pattern: Each hook returns `{ data, loading, error, createMutation, updateMutation, deleteMutation }`. Mutations call `queryClient.invalidateQueries()` on success and show toast notifications.

**Mongoose Models:**
- Purpose: Define MongoDB document schemas with validation and methods
- Examples: `server/src/models/Player.ts`, `server/src/models/User.ts`, `server/src/models/Gallery.ts`
- Pattern: Schema defined with Mongoose `Schema`, exported as `mongoose.model<IType>()`. User model includes instance methods (`matchPassword`, `getResetPasswordToken`) and pre-save hooks (password hashing).

**Express Async Handler:**
- Purpose: Wrap controller functions to catch async errors and forward to error middleware
- Examples: Every controller function is wrapped with `asyncHandler(async (req, res) => { ... })`
- Pattern: Errors thrown inside controllers are caught and passed to `server/src/middleware/error.middleware.ts`

## Entry Points

**Server Entry:**
- Location: `server/src/server.ts`
- Triggers: `npm run dev` (nodemon + ts-node) or `npm start` (compiled `dist/server.js`)
- Responsibilities: Loads env vars, imports `app.ts`, starts HTTP listener on PORT (default 5000)

**Server App Configuration:**
- Location: `server/src/app.ts`
- Triggers: Imported by `server.ts`
- Responsibilities: Creates Express app, connects MongoDB, configures CORS, mounts all route handlers under `/api/`, registers global error handler

**Client Entry:**
- Location: `client/src/main.tsx`
- Triggers: Vite dev server or built `dist/` bundle
- Responsibilities: Mounts React root with Redux Provider, React Query QueryClientProvider, and `<App />`

**Client Router:**
- Location: `client/src/App.tsx`
- Triggers: Browser navigation
- Responsibilities: Defines all routes via `createBrowserRouter`. Two layout branches: `PublicLayout` (Navbar + Footer wrapping public pages) and `AdminLayout` (sidebar + Outlet for admin pages). Admin routes wrapped in `ProtectedRoute` component.

## API Routes

| Prefix | Route File | Resources |
|--------|-----------|-----------|
| `/api/auth` | `server/src/routes/auth.route.ts` | Register, login, profile, forgot/reset password |
| `/api/players` | `server/src/routes/player.route.ts` | CRUD players + image upload |
| `/api/coaches` | `server/src/routes/coach.route.ts` | CRUD coaches |
| `/api/galleries` | `server/src/routes/gallery.route.ts` | CRUD galleries + image upload |
| `/api/activities` | `server/src/routes/activity.route.ts` | CRUD activities |
| `/api/news` | `server/src/routes/news.route.ts` | CRUD news articles |
| `/api/our-club` | `server/src/routes/ourclub.route.ts` | Club information management |

## Error Handling

**Strategy:** Throw-and-catch pattern with centralized error middleware

**Server Patterns:**
- Controllers throw errors with `res.status(N); throw new Error("message")` inside `asyncHandler` wrappers
- Global error handler at `server/src/middleware/error.middleware.ts` catches all errors, returns `{ status: false, message, stack? }`
- Mongoose `CastError` (invalid ObjectId) mapped to 404 automatically
- Stack traces included only in non-production environments

**Client Patterns:**
- React Query `onError` callbacks extract `error.response?.data?.message` and display via `react-toastify`
- Each mutation in hooks has its own `onError` handler
- `ProtectedRoute` component at `client/src/components/ProtectedRoutes.tsx` redirects unauthenticated users to `/login` and unauthorized users to `/unauthorized`

## Cross-Cutting Concerns

**Logging:** `server/src/middleware/requestLogger.ts` logs all incoming requests. Controllers use `console.log`/`console.error` directly.

**Validation:**
- Server: Manual field checking in controllers (no validation library on backend)
- Client: Zod schemas at `client/src/schemas/` integrated with react-hook-form via `@hookform/resolvers`

**Authentication:** JWT-based Bearer token. Server middleware at `server/src/middleware/auth.middleware.ts` verifies token and attaches `req.user`. Client stores token in Redux + localStorage, injects via Axios interceptor.

**Authorization:** Role-based (`admin`, `editor`, `public`). Server uses `authorizeRoles()` middleware. Client uses `ProtectedRoute` component with `allowedRoles` prop.

**Image Upload:** Multer (memory storage, 5MB limit, images only) at `server/src/middleware/upload.middleware.ts` -> Cloudinary upload via `server/src/utils/uploadImage.ts`.

---

*Architecture analysis: 2026-05-01*
