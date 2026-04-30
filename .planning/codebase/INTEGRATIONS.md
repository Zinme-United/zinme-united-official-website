# External Integrations

**Analysis Date:** 2026-05-01

## APIs & External Services

**Image Management:**
- Cloudinary - Image upload, storage, transformation, and CDN delivery
  - SDK/Client: `cloudinary` v2.6.1 (`server/src/config/cloudinary.ts`)
  - Upload utility: `server/src/utils/uploadImage.ts` (upload with auto-quality, auto-format, configurable dimensions)
  - Delete utility: `server/src/utils/uploadImage.ts` (`deleteImage` function)
  - Auth env vars: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
  - Default upload folder: `"players"`
  - Default transform: 400x400 crop fill, auto quality, auto format

**Email (Installed but Unused):**
- Nodemailer 7.0.3 is listed in `server/package.json` dependencies but is NOT imported anywhere in the source code
  - Likely intended for password reset emails (currently reset tokens are returned directly in API response for dev mode)
  - Auth env vars: Not yet configured

## Internal REST API

**Base URL:** Configured via `VITE_API_BASE_URL` env var on client (`client/src/api/axiosInstance.ts`)

**Endpoints (defined in `server/src/app.ts`):**

| Route Prefix | Route File | Purpose |
|---|---|---|
| `/api/auth` | `server/src/routes/auth.route.ts` | User registration, login, profile, password reset |
| `/api/players` | `server/src/routes/player.route.ts` | Player CRUD with image upload |
| `/api/coaches` | `server/src/routes/coach.route.ts` | Coach management |
| `/api/galleries` | `server/src/routes/gallery.route.ts` | Photo gallery management |
| `/api/activities` | `server/src/routes/activity.route.ts` | Club activities/matches |
| `/api/news` | `server/src/routes/news.route.ts` | News articles |
| `/api/our-club` | `server/src/routes/ourclub.route.ts` | Club info management |

**API Client Pattern:**
- Axios instance with base URL from env var (`client/src/api/axiosInstance.ts`)
- Request interceptor auto-attaches Bearer token from Redux store
- Content-Type defaults to `application/json`

## Data Storage

**Database:**
- MongoDB (via Mongoose 8.15.0)
  - Connection: `MONGODB_URI` env var
  - Client: Mongoose ODM (`server/src/config/db.ts`)
  - Connection: `mongoose.connect(mongoUri)` with no additional options

**Models (all in `server/src/models/`):**
- `User.ts` - User accounts with roles (admin/editor/public), password hashing, reset tokens
- `Player.ts` - Player profiles
- `Coach.ts` - Coach profiles
- `News.ts` - News articles
- `Gallery.ts` - Photo galleries
- `Activity.ts` - Club activities/matches
- `OurClub.ts` - Club information

**File Storage:**
- Cloudinary (cloud-based image CDN)
- Multer with memory storage for upload buffering (`server/src/middleware/upload.middleware.ts`)
  - 5MB file size limit
  - Image-only file filter (`image/*` MIME types)
  - Single image upload: `uploadSingle` middleware
  - Activity logos: `uploadActivityLogos` middleware (handles `homeTeamLogoFile` and `opponentTeamLogoFile` fields)

**Caching:**
- None (no Redis or in-memory cache configured)
- TanStack React Query provides client-side query caching

## Authentication & Identity

**Auth Provider:** Custom JWT-based implementation

**Implementation:**
- Registration/Login: `server/src/controllers/auth.controller.ts`
- Password hashing: bcryptjs with salt rounds of 10 (`server/src/models/User.ts`)
- Token generation: JWT signed with `JWT_SECRET`, 1-hour expiry (`server/src/utils/generateToken.ts`)
- Token payload: `{ id, role }`
- Auth middleware: Bearer token verification (`server/src/middleware/auth.middleware.ts`)
- Role-based access: `authorizeRoles("admin", "editor")` middleware for protected routes
- Password reset: Crypto-based token with 10-minute expiry (dev mode returns token in response; email sending not yet implemented)

**Client-side auth:**
- Redux Toolkit slice stores user, token, role, isLoggedIn (`client/src/store/authSlice.ts`)
- Token persisted in `localStorage`
- Axios interceptor attaches `Authorization: Bearer <token>` header (`client/src/api/axiosInstance.ts`)
- Protected routes component: `client/src/components/ProtectedRoutes.tsx`

**User Roles:**
- `admin` - Full access
- `editor` - Content management access
- `public` - Default role for new registrations

## Monitoring & Observability

**Error Tracking:**
- None (no Sentry, Datadog, or similar)

**Logs:**
- `console.log` / `console.error` throughout server code
- Custom request logger middleware: `server/src/middleware/requestLogger.ts`
- Error middleware includes stack traces in non-production mode (`server/src/middleware/error.middleware.ts`)

## CI/CD & Deployment

**Client Hosting:**
- Vercel (`client/.vercel/` directory present)
- `client/vercel.json` configures SPA rewrites (all routes -> `/index.html`)
- Production URLs: `https://zmutd.vercel.app`, `https://zinmeutd.com`

**Server Hosting:**
- Vercel and/or Render (`server/.vercel/` present; CORS allows Render origins)
- Entry point: `server/dist/server.js`

**CI Pipeline:**
- None detected (no GitHub Actions, no `.github/workflows/`)

## Environment Configuration

**Required env vars (server):**
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `PORT` - Server port (optional, defaults to 5000)
- `NODE_ENV` - Environment mode (optional)
- `CORS_ORIGIN_PROD` - Production client URL (optional, hardcoded fallbacks exist)
- `CORS_ORIGIN_DEV` - Development client URL (optional)
- `CORS_ORIGIN_RENDER` - Render client URL (optional)

**Required env vars (client):**
- `VITE_API_BASE_URL` - Backend API base URL

**Secrets location:**
- `.env` files in both `client/` and `server/` directories (gitignored)
- Vercel environment settings for production

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- None detected

---

*Integration audit: 2026-05-01*
