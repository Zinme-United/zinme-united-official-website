# Technology Stack

**Analysis Date:** 2026-05-01

## Languages

**Primary:**
- TypeScript ~5.8.3 - Used across both client and server

**Secondary:**
- JavaScript - ESLint config (`client/eslint.config.js`)

## Runtime

**Environment:**
- Node.js (version not pinned; no `.nvmrc` or `.node-version` file detected)

**Package Manager:**
- npm
- Lockfiles: `client/package-lock.json` and `server/package-lock.json` (both present)

## Project Structure

**Monorepo (manual):**
- `client/` - React SPA frontend
- `server/` - Express REST API backend
- No workspace manager (no root `package.json`); each directory manages its own dependencies independently

## Frameworks

**Core:**
- React 19.1.0 - Frontend UI (`client/`)
- Express 5.1.0 - Backend REST API (`server/`)
- Mongoose 8.15.0 - MongoDB ODM (`server/`)

**State Management:**
- Redux Toolkit 2.8.2 + React Redux 9.2.0 - Client-side auth state (`client/src/store/`)
- TanStack React Query 5.77.0 - Server state / data fetching (`client/src/hooks/`)

**Forms & Validation:**
- React Hook Form 7.56.4 - Form management
- Zod 3.25.28 + @hookform/resolvers 5.0.1 - Schema validation (`client/src/schemas/`)

**Routing:**
- React Router 7.5.3 - Client-side routing (`client/src/App.tsx`)

**Build/Dev:**
- Vite 6.3.5 + @vitejs/plugin-react 4.4.1 - Frontend build tool (`client/vite.config.ts`)
- TypeScript ~5.8.3 (client) / ^5.8.3 (server) - Type checking
- nodemon + ts-node - Server dev hot-reload

**Linting:**
- ESLint 9.25.0 with flat config (`client/eslint.config.js`)
- typescript-eslint 8.30.1
- eslint-plugin-react-hooks 5.2.0
- eslint-plugin-react-refresh 0.4.19

**Testing:**
- No test framework installed. Server `test` script is a placeholder: `echo "Error: no test specified"`

## Key Dependencies

**Critical (Client):**
- `axios` 1.9.0 - HTTP client with interceptors for auth token injection (`client/src/api/axiosInstance.ts`)
- `tailwindcss` 4.1.5 + `@tailwindcss/vite` 4.1.5 - Utility-first CSS framework (Tailwind v4, Vite plugin integration)
- `@headlessui/react` 2.2.7 - Accessible UI primitives (modals, menus)
- `swiper` 11.2.10 - Touch slider/carousel component
- `lottie-react` 2.4.1 - Lottie animation rendering
- `lucide-react` 0.508.0 + `react-icons` 5.5.0 - Icon libraries
- `qrcode.react` 4.2.0 - QR code generation for player profiles
- `react-toastify` 11.0.5 - Toast notifications
- `react-spinners` 0.17.0 - Loading spinner components
- `date-fns` 4.1.0 + `dayjs` 1.11.13 - Date utilities (two date libraries present)

**Critical (Server):**
- `mongoose` 8.15.0 - MongoDB object modeling (`server/src/models/`)
- `jsonwebtoken` 9.0.2 - JWT token generation and verification (`server/src/utils/generateToken.ts`)
- `bcryptjs` 3.0.2 - Password hashing (`server/src/models/User.ts`)
- `cloudinary` 2.6.1 - Image upload and storage (`server/src/config/cloudinary.ts`, `server/src/utils/uploadImage.ts`)
- `multer` 2.0.0 - Multipart file upload handling (`server/src/middleware/upload.middleware.ts`)
- `cors` 2.8.5 - Cross-origin resource sharing (`server/src/app.ts`)
- `dotenv` 16.5.0 - Environment variable loading
- `express-async-handler` 1.2.0 - Async error handling wrapper for Express routes
- `nodemailer` 7.0.3 - Email sending (installed but not yet imported in source code)

**Infrastructure:**
- `nodemon` 3.1.10 - Server auto-restart in development (incorrectly listed as production dependency)
- `react-redux` 9.2.0 - Listed in both client AND server `package.json` (server copy is unnecessary)

## Configuration

**TypeScript:**
- Client: `client/tsconfig.json` (references `tsconfig.app.json` and `tsconfig.node.json`)
  - Target: ES2020, Module: ESNext, JSX: react-jsx, Strict mode enabled
  - `client/tsconfig.app.json` - App source config (bundler module resolution, `noUnusedLocals`, `noUnusedParameters`)
  - `client/tsconfig.node.json` - Node tooling config
- Server: `server/tsconfig.json`
  - Target: ES2020, Module: CommonJS, Strict mode enabled
  - Root: `./src`, Output: `./dist`

**Environment:**
- Client: `.env` file present - uses `VITE_API_BASE_URL` via `import.meta.env` (`client/src/api/axiosInstance.ts`)
- Server: `.env` file present - uses `dotenv.config()` pattern
- Required server env vars (referenced in code):
  - `MONGODB_URI` - MongoDB connection string
  - `JWT_SECRET` - JWT signing secret
  - `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
  - `CLOUDINARY_API_KEY` - Cloudinary API key
  - `CLOUDINARY_API_SECRET` - Cloudinary API secret
  - `PORT` - Server port (defaults to 5000)
  - `NODE_ENV` - Environment mode
  - `CORS_ORIGIN_PROD` - Production CORS origin
  - `CORS_ORIGIN_DEV` - Development CORS origin
  - `CORS_ORIGIN_RENDER` - Render deployment CORS origin

**Build:**
- Client build: `tsc -b && vite build` -> outputs to `client/dist/`
- Server build: `tsc` -> outputs to `server/dist/`
- Server start: `node dist/server.js`

## Platform Requirements

**Development:**
- Node.js (version unspecified; ES2020 target implies Node 14+, Express 5 likely needs Node 18+)
- npm
- MongoDB instance (local or cloud)
- Cloudinary account

**Production:**
- Client: Deployed to Vercel (`client/.vercel/` directory, `client/vercel.json` with SPA rewrites)
- Server: Deployed to Vercel or Render (`server/.vercel/` directory present; CORS allows Render origins)
- MongoDB Atlas (implied by cloud deployment)
- Cloudinary for image CDN

---

*Stack analysis: 2026-05-01*
