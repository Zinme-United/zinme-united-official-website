# Codebase Structure

**Analysis Date:** 2026-05-01

## Directory Layout

```
zinme-united-official-website/
├── client/                     # React SPA (Vite + TypeScript)
│   ├── public/                 # Static assets served as-is
│   ├── dist/                   # Vite build output (generated, not committed)
│   ├── src/
│   │   ├── api/                # Axios instance and HTTP config
│   │   ├── assets/             # Images, Lottie animations
│   │   ├── components/         # Shared UI components (flat, barrel-exported)
│   │   ├── constants/          # Static data and route definitions
│   │   ├── hooks/              # Custom React hooks (data fetching per entity)
│   │   ├── layouts/            # Layout wrappers (AdminLayout)
│   │   ├── pages/              # Page components (one dir per route)
│   │   ├── schemas/            # Zod validation schemas (one per entity)
│   │   ├── store/              # Redux store and slices (auth only)
│   │   ├── types/              # TypeScript type definitions
│   │   ├── utils/              # Utility functions
│   │   ├── App.tsx             # Router configuration and layouts
│   │   ├── App.css             # Global app styles
│   │   ├── main.tsx            # React root mount with providers
│   │   ├── index.css           # Tailwind CSS entry
│   │   ├── vite-env.d.ts       # Vite env type declarations
│   │   └── swiper.d.ts         # Swiper module type declarations
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── server/                     # Express API (TypeScript + Node.js)
│   ├── dist/                   # TypeScript build output (generated)
│   ├── src/
│   │   ├── config/             # DB connection, Cloudinary setup
│   │   ├── controllers/        # Request handlers per resource
│   │   ├── middleware/          # Auth, upload, error, logging middleware
│   │   ├── models/             # Mongoose schemas and models
│   │   ├── routes/             # Express route definitions
│   │   ├── types/              # TypeScript interfaces and type definitions
│   │   ├── utils/              # Token generation, image upload helpers
│   │   ├── app.ts              # Express app setup (CORS, routes, middleware)
│   │   └── server.ts           # Entry point (dotenv, listen)
│   ├── package.json
│   └── tsconfig.json
├── .planning/                  # Project planning documents
│   └── codebase/               # Codebase analysis documents
├── .vercel/                    # Vercel deployment config (root)
├── .vscode/                    # VS Code workspace settings
├── .gitignore
└── .DS_Store
```

## Directory Purposes

**`client/src/api/`:**
- Purpose: HTTP client configuration
- Contains: Single file `axiosInstance.ts`
- Key files: `client/src/api/axiosInstance.ts` -- Axios instance with base URL from `VITE_API_BASE_URL` env var and Bearer token interceptor

**`client/src/components/`:**
- Purpose: All shared/reusable UI components
- Contains: Flat list of `.tsx` files (no subdirectories), barrel file for exports
- Key files: `client/src/components/index.ts` (barrel), `client/src/components/Navbar.tsx`, `client/src/components/Footer.tsx`, `client/src/components/ProtectedRoutes.tsx`, `client/src/components/HeroSection.tsx`
- Pattern: Each component is a single `.tsx` file with a default export. Barrel file re-exports all.

**`client/src/hooks/`:**
- Purpose: Custom hooks encapsulating React Query data fetching per entity
- Contains: One hook file per domain entity
- Key files: `client/src/hooks/usePlayers.ts`, `client/src/hooks/useAuth.ts`, `client/src/hooks/useNews.ts`, `client/src/hooks/useGalleries.ts`, `client/src/hooks/useActivities.ts`, `client/src/hooks/useOurClub.ts`, `client/src/hooks/useGetPlayerById.ts`, `client/src/hooks/useGetGalleryById.ts`, `client/src/hooks/useSingleNews.ts`

**`client/src/pages/`:**
- Purpose: Route-level page components
- Contains: One subdirectory per page/route, each with a single `.tsx` file
- Key files: `client/src/pages/home/Home.tsx`, `client/src/pages/players/Players.tsx`, `client/src/pages/player-details/PlayerDetails.tsx`, `client/src/pages/dashboard/AdminDashboard.tsx`, `client/src/pages/player-management/PlayerManagementPage.tsx`

**`client/src/schemas/`:**
- Purpose: Zod form validation schemas
- Contains: One schema file per entity
- Key files: `client/src/schemas/playerSchemas.ts`, `client/src/schemas/authSchemas.ts`, `client/src/schemas/gallerySchemas.ts`, `client/src/schemas/newsSchemas.ts`, `client/src/schemas/ourClubSchemas.ts`, `client/src/schemas/activitySchemas.ts`

**`client/src/store/`:**
- Purpose: Redux Toolkit store (auth state only)
- Contains: Store config and auth slice
- Key files: `client/src/store/index.ts` (store config, exports `RootState` and `AppDispatch` types), `client/src/store/authSlice.ts`

**`client/src/types/`:**
- Purpose: Shared TypeScript interfaces for all domain entities
- Contains: Single `index.d.ts` with all types
- Key files: `client/src/types/index.d.ts` -- defines `Player`, `Gallery`, `Activity`, `News`, `AuthUser`, `AuthState`, `ApiResponse<T>`, component prop types

**`client/src/utils/`:**
- Purpose: Small utility functions
- Contains: `formatStatLabel.ts`, `positionToMarkers.ts`

**`client/src/layouts/`:**
- Purpose: Layout wrappers with navigation chrome
- Contains: `AdminLayout.tsx` (sidebar nav + outlet)
- Note: `PublicLayout` is defined inline in `client/src/App.tsx`, not in this directory

**`server/src/config/`:**
- Purpose: External service configuration
- Contains: `db.ts` (MongoDB connection via Mongoose), `cloudinary.ts` (Cloudinary SDK setup)

**`server/src/controllers/`:**
- Purpose: Request handling logic per resource
- Contains: One controller file per resource with exported async handler functions
- Key files: `server/src/controllers/player.controller.ts`, `server/src/controllers/auth.controller.ts`, `server/src/controllers/gallery.controller.ts`, `server/src/controllers/news.controller.ts`, `server/src/controllers/activity.controller.ts`, `server/src/controllers/ourclub.controller.ts`, `server/src/controllers/coach.controller.ts`

**`server/src/middleware/`:**
- Purpose: Express middleware functions
- Key files: `server/src/middleware/auth.middleware.ts` (JWT protect + role check), `server/src/middleware/upload.middleware.ts` (multer config for image uploads), `server/src/middleware/error.middleware.ts` (global error handler), `server/src/middleware/requestLogger.ts`

**`server/src/models/`:**
- Purpose: Mongoose document schemas and models
- Key files: `server/src/models/Player.ts`, `server/src/models/User.ts`, `server/src/models/Gallery.ts`, `server/src/models/News.ts`, `server/src/models/Activity.ts`, `server/src/models/OurClub.ts`, `server/src/models/Coach.ts`

**`server/src/routes/`:**
- Purpose: Express route definitions mapping HTTP methods to controller functions
- Key files: `server/src/routes/player.route.ts`, `server/src/routes/auth.route.ts`, `server/src/routes/gallery.route.ts`, `server/src/routes/news.route.ts`, `server/src/routes/activity.route.ts`, `server/src/routes/ourclub.route.ts`, `server/src/routes/coach.route.ts`

**`server/src/utils/`:**
- Purpose: Shared utility functions
- Key files: `server/src/utils/generateToken.ts` (JWT generation), `server/src/utils/uploadImage.ts` (Cloudinary upload/delete)

**`server/src/types/`:**
- Purpose: TypeScript interfaces for server-side domain models
- Key files: `server/src/types/index.d.ts` -- defines `IPlayer`, `IActivity`, `PlayerStats`, `PlayerSocial`, `UploadOptions`, `BackendErrorResponse`, `ActivityFormData`

## Key File Locations

**Entry Points:**
- `client/src/main.tsx`: React app bootstrap (providers + root render)
- `client/src/App.tsx`: All client routes defined here via `createBrowserRouter`
- `server/src/server.ts`: Node.js entry point (dotenv + listen)
- `server/src/app.ts`: Express app configuration (CORS, middleware, route mounting)

**Configuration:**
- `client/package.json`: Client dependencies and scripts
- `server/package.json`: Server dependencies and scripts
- `client/src/api/axiosInstance.ts`: API base URL and auth interceptor config

**Core Logic:**
- `server/src/controllers/auth.controller.ts`: Authentication (register, login, forgot/reset password)
- `server/src/middleware/auth.middleware.ts`: JWT verification and role authorization
- `client/src/store/authSlice.ts`: Client-side auth state management
- `client/src/components/ProtectedRoutes.tsx`: Client-side route protection

**Types:**
- `client/src/types/index.d.ts`: All client-side TypeScript interfaces
- `server/src/types/index.d.ts`: All server-side TypeScript interfaces

## Naming Conventions

**Files:**
- Client components: PascalCase (`HeroSection.tsx`, `PlayerModal.tsx`, `ProtectedRoutes.tsx`)
- Client hooks: camelCase with `use` prefix (`usePlayers.ts`, `useAuth.ts`, `useGetPlayerById.ts`)
- Client pages: PascalCase inside kebab-case directories (`pages/player-management/PlayerManagementPage.tsx`)
- Client schemas: camelCase (`playerSchemas.ts`, `authSchemas.ts`)
- Server controllers: kebab-case with `.controller` suffix (`player.controller.ts`, `auth.controller.ts`)
- Server routes: kebab-case with `.route` suffix (`player.route.ts`, `auth.route.ts`)
- Server middleware: camelCase or kebab-case with `.middleware` suffix (`auth.middleware.ts`, `error.middleware.ts`, `requestLogger.ts`)
- Server models: PascalCase (`Player.ts`, `User.ts`, `Gallery.ts`)

**Directories:**
- Client pages: kebab-case (`player-management/`, `gallery-details/`, `articles-details/`)
- All other directories: lowercase single words (`hooks/`, `schemas/`, `components/`, `controllers/`, `models/`)

**Exports:**
- Components: default export per file, re-exported via barrel `client/src/components/index.ts`
- Hooks: default export per file, imported directly (no barrel)
- Controllers: named exports per function
- Models: default export of Mongoose model
- Types: named exports from `index.d.ts`

## Where to Add New Code

**New Public Page:**
1. Create directory: `client/src/pages/{kebab-case-name}/`
2. Create page component: `client/src/pages/{kebab-case-name}/{PascalCaseName}.tsx`
3. Add route in `client/src/App.tsx` under the `PublicLayout` children array
4. If the page needs data, create a hook in `client/src/hooks/`

**New Admin Management Page:**
1. Create directory: `client/src/pages/{entity}-management/`
2. Create page component: `client/src/pages/{entity}-management/{Entity}ManagementPage.tsx`
3. Add route in `client/src/App.tsx` under the `/admin` children array (inside `ProtectedRoute`)
4. Add sidebar link in `client/src/layouts/AdminLayout.tsx`

**New API Resource (full CRUD):**
1. Create model: `server/src/models/{Entity}.ts` -- Mongoose schema with TypeScript interface
2. Add types: Add interface to `server/src/types/index.d.ts`
3. Create controller: `server/src/controllers/{entity}.controller.ts` -- wrap handlers with `asyncHandler`
4. Create route: `server/src/routes/{entity}.route.ts` -- map HTTP methods, apply `protect`/`authorizeRoles` for write routes
5. Mount route in `server/src/app.ts`: `app.use("/api/{entities}", entityRoutes)`
6. Add client types to `client/src/types/index.d.ts`
7. Create client hook: `client/src/hooks/use{Entities}.ts` -- React Query queries and mutations
8. Create Zod schema: `client/src/schemas/{entity}Schemas.ts`

**New Shared Component:**
1. Create component: `client/src/components/{PascalCaseName}.tsx`
2. Add export to barrel: `client/src/components/index.ts`

**New Utility Function:**
- Client: Add to `client/src/utils/{camelCaseName}.ts`
- Server: Add to `server/src/utils/{camelCaseName}.ts`

**New Middleware:**
- Add to `server/src/middleware/{name}.middleware.ts` or `server/src/middleware/{camelCaseName}.ts`

## Special Directories

**`client/dist/`:**
- Purpose: Vite production build output
- Generated: Yes (`npm run build`)
- Committed: No (should be in .gitignore)

**`server/dist/`:**
- Purpose: TypeScript compiled JavaScript output
- Generated: Yes (`npm run build` / `tsc`)
- Committed: Appears to be committed (check .gitignore)

**`.vercel/`:**
- Purpose: Vercel deployment configuration and cache
- Generated: Yes (by Vercel CLI)
- Committed: Partially (exists at root, client, and server level)

**`client/public/`:**
- Purpose: Static files served at root URL path
- Generated: No
- Committed: Yes

---

*Structure analysis: 2026-05-01*
