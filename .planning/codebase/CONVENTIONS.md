# Coding Conventions

**Analysis Date:** 2026-05-01

## Project Structure

**Monorepo Layout:** Two independent projects — `client/` (React SPA) and `server/` (Express API) — each with their own `package.json`, `tsconfig.json`, and `node_modules/`.

## Naming Patterns

**Files (Client):**
- Pages: PascalCase in kebab-case directories — `client/src/pages/player-details/PlayerDetails.tsx`
- Components: PascalCase — `client/src/components/HeroSection.tsx`, `client/src/components/PlayerModal.tsx`
- Hooks: camelCase with `use` prefix — `client/src/hooks/usePlayers.ts`, `client/src/hooks/useAuth.ts`
- Schemas: camelCase with entity + "Schemas" suffix — `client/src/schemas/playerSchemas.ts`
- Utils: camelCase — `client/src/utils/formatStatLabel.ts`
- Types: `index.d.ts` barrel file — `client/src/types/index.d.ts`

**Files (Server):**
- Controllers: kebab-case with `.controller.ts` suffix — `server/src/controllers/player.controller.ts`
- Routes: kebab-case with `.route.ts` suffix — `server/src/routes/player.route.ts`
- Models: PascalCase — `server/src/models/Player.ts`, `server/src/models/User.ts`
- Middleware: camelCase — `server/src/middleware/auth.middleware.ts`, `server/src/middleware/requestLogger.ts`
- Utils: camelCase — `server/src/utils/generateToken.ts`, `server/src/utils/uploadImage.ts`

**Functions:**
- Use camelCase for all functions: `createPlayer`, `handleLogout`, `formatStatLabel`
- React components use PascalCase: `HeroSection`, `PlayerFormModal`
- Event handlers use `handle` prefix: `handleFileChange`, `handleFormSubmit`, `handleLogout`
- Express controller functions are named exports with verb-noun pattern: `getPlayers`, `createPlayer`, `deletePlayer`, `uploadPlayerImage`

**Variables:**
- Use camelCase: `queryClient`, `playersQuery`, `nextMatchData`
- Boolean variables use `is`/`has` prefix: `isLoggedIn`, `isSubmitting`, `isCreatingActivity`
- Constants use camelCase (not SCREAMING_SNAKE): `routeLinks`, `defaultSlides`

**Types/Interfaces:**
- Interfaces use PascalCase: `Player`, `Activity`, `ApiResponse<T>`
- Server-side Mongoose document interfaces use `I` prefix: `IPlayer`, `IActivity`
- Client-side interfaces do NOT use `I` prefix: `Player`, `Activity`, `Gallery`
- Form data types use `FormData` suffix: `PlayerFormData`, `ActivityFormData`, `GalleryFormData`
- Props interfaces use `Props` suffix: `PlayerFormModalProps`, `GalleryModalProps`, `HeroSectionProps`

## Code Style

**Formatting:**
- No Prettier config detected — use default IDE formatting
- Double quotes for strings throughout (both client and server)
- Semicolons are used
- 2-space indentation (inferred from file content)
- Trailing commas in multi-line structures

**Linting:**
- ESLint with flat config (`client/eslint.config.js`)
- Extends: `@eslint/js` recommended + `typescript-eslint` recommended
- Plugins: `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`
- Key rule: `react-refresh/only-export-components` set to warn with `allowConstantExport: true`
- Server has no ESLint configuration

**TypeScript:**
- Client: `strict: true`, `noUnusedLocals: true`, `noUnusedParameters: true` in `client/tsconfig.app.json`
- Server: `strict: true`, `esModuleInterop: true` in `server/tsconfig.json`
- Client target: ES2020, module: ESNext (bundler mode)
- Server target: ES2020, module: commonjs

## Import Organization

**Order (observed pattern):**
1. External library imports (React, third-party packages)
2. Internal absolute imports (components, hooks, store, api)
3. Type imports (using `import type` syntax)
4. CSS imports (at the end)

**Example from** `client/src/hooks/usePlayers.ts`:
```typescript
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import { AxiosError } from "axios";
import type { ApiResponse, BackendErrorResponse, Player } from "../types";
import { toast } from "react-toastify";
```

**Path Aliases:**
- No path aliases configured. All imports use relative paths (`../`, `../../`).

**Barrel Files:**
- Components use a barrel file at `client/src/components/index.ts` that re-exports default exports
- Pattern: `export { default as ComponentName } from "./ComponentName";`
- Not all components are in the barrel (some imported directly like `Loader`, `PartnersBanner`)

## Component Patterns

**Component Definition:**
- Use arrow function components with `const` declaration
- Default export at bottom of file: `export default ComponentName;`
- Props typed inline with `type` keyword or via imported interface from `client/src/types/index.d.ts`

**Example pattern:**
```typescript
type HeroSectionProps = {
  nextMatch?: Activity | null;
  slides?: Array<{ image: string; headline: string; sub: string; ctaText: string; ctaHref: string }>;
};

const HeroSection = ({ nextMatch, slides = defaultSlides }: HeroSectionProps) => {
  return ( /* JSX */ );
};

export default HeroSection;
```

**For components with complex props (modals):**
```typescript
const PlayerFormModal: React.FC<PlayerFormModalProps> = ({ isOpen, onClose, editingPlayer, onSubmit, isSubmitting }) => {
  // ...
};
```

## Hook Patterns

**Custom hooks follow a consistent structure in `client/src/hooks/`:**
1. Initialize `queryClient` from React Query
2. Define queries using `useQuery` with full generic types
3. Define mutations using `useMutation` with full generic types
4. Each mutation has `onSuccess` (invalidate queries + toast) and `onError` (toast error)
5. Return an object with computed values and mutation functions

**Return object convention (from `client/src/hooks/usePlayers.ts`):**
```typescript
return {
  players: playersQuery.data?.data,          // Unwrapped data
  playersLoading: playersQuery.isLoading,    // Loading state
  playersError: playersQuery.error,          // Error state
  createPlayer: createPlayerMutation.mutate, // Mutation shortcut
  createPlayerMutation,                      // Full mutation object
};
```

## Form Handling

**Stack:** react-hook-form + zod + @hookform/resolvers
- Schemas defined in `client/src/schemas/` directory, one file per entity
- Use `zodResolver(schema)` to connect Zod schema to react-hook-form
- Types inferred from schemas: `type PlayerFormData = z.infer<typeof playerFormSchema>`

**Example from** `client/src/components/PlayerModal.tsx`:
```typescript
const { register, handleSubmit, reset, formState: { errors } } = useForm<PlayerFormData>({
  resolver: zodResolver(playerFormSchema),
  defaultValues: { /* ... */ },
});
```

## Error Handling

**Client-side:**
- API errors typed as `AxiosError<BackendErrorResponse>` throughout
- Error extraction pattern in mutation `onError`:
  ```typescript
  const errorMessage = error.response?.data?.message || error.message || "Fallback message";
  toast.error(errorMessage);
  console.error("Context:", errorMessage);
  ```
- User-facing errors shown via `react-toastify` toast notifications
- `console.error` used for developer-facing error logging

**Server-side:**
- Uses `express-async-handler` wrapper on all controller functions to catch async errors
- Error pattern: set `res.status(code)` then `throw new Error("message")`
- Centralized error handler in `server/src/middleware/error.middleware.ts`
- Handles Mongoose CastError specially (maps to 404)
- Stack traces included in non-production responses

**Server error response shape (from** `server/src/middleware/error.middleware.ts`):
```typescript
{ status: false, message: "Error message", stack: "..." }  // dev
{ status: false, message: "Error message", stack: null }    // production
```

## Logging

**Framework:** `console` (both client and server)

**Patterns:**
- Server uses `console.log` in `server/src/middleware/requestLogger.ts` for request logging
- Client uses `console.log` for success and `console.error` for failures in mutation callbacks
- No structured logging library in use

## State Management

**Dual approach:**
- **Redux Toolkit** (`client/src/store/`) for auth state (token, user, isLoggedIn)
- **React Query** (`@tanstack/react-query`) for server state (players, activities, galleries, news)
- Auth token persisted in `localStorage`

## Styling

**Approach:** Tailwind CSS v4 via `@tailwindcss/vite` plugin
- Utility-first classes applied inline in JSX
- Brand colors used as hex literals: `#003b75` (primary blue), `#FFD700` (gold accent), `#001529` (dark navy)
- No design tokens or CSS variables for brand colors — hardcoded throughout
- Responsive prefixes: `md:`, `sm:` used for breakpoints
- No component library (custom components only)

## Comments

**When to Comment:**
- JSDoc-style `@desc`, `@route`, `@access` comments on controller functions (inconsistent — some have them, some do not)
- Inline comments explain "why" for non-obvious logic
- Section comments in JSX (e.g., `{/* Gradient overlay */}`, `{/* Stats Section */}`)

**JSDoc/TSDoc:**
- Not systematically used. Some controllers have route documentation comments; most code has no JSDoc.

## Module Design

**Exports:**
- Components and hooks use default exports
- Types/interfaces use named exports from `index.d.ts` barrel files
- Store actions use named exports: `export const { setCredentials, logout } = authSlice.actions`
- Server controllers and middleware use named exports

**API Response Contract:**
- Standard response shape: `{ status: boolean, message: string, data?: T, count?: number }`
- Client types mirror this in `client/src/types/index.d.ts` as `ApiResponse<T>`

---

*Convention analysis: 2026-05-01*
