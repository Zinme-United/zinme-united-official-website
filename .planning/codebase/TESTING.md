# Testing Patterns

**Analysis Date:** 2026-05-01

## Test Framework

**Runner:**
- No test framework is installed or configured

**Status:**
- The server `package.json` has a placeholder test script: `"test": "echo \"Error: no test specified\" && exit 1"`
- The client `package.json` has no test script at all
- No test runner (Jest, Vitest, Mocha, etc.) is present in either `dependencies` or `devDependencies`
- No test configuration files exist (no `jest.config.*`, `vitest.config.*`, `.mocharc.*`)

## Test Files

**Existing Tests:**
- None. Zero test files exist in the entire codebase. No `*.test.*`, `*.spec.*`, or `__tests__/` directories were found.

## Test Infrastructure

**Assertion Library:** Not installed
**Mocking Library:** Not installed
**Coverage Tool:** Not installed
**E2E Framework:** Not installed

## Recommended Setup

Given the tech stack (Vite + React + TypeScript on client, Express + TypeScript on server), the recommended test setup would be:

**Client (React SPA):**
- Runner: Vitest (native Vite integration)
- Config: `client/vitest.config.ts`
- Testing Library: `@testing-library/react` for component tests
- Run command: add `"test": "vitest"` to `client/package.json` scripts

**Server (Express API):**
- Runner: Vitest or Jest
- Config: `server/vitest.config.ts` or `server/jest.config.ts`
- HTTP testing: `supertest` for endpoint integration tests
- Run command: replace placeholder in `server/package.json` scripts

## What Should Be Tested (Priority Order)

**High Priority — Server:**
1. Auth flows: `server/src/controllers/auth.controller.ts` — login, register, token validation, password reset
2. Middleware: `server/src/middleware/auth.middleware.ts` — protect and authorizeRoles
3. Error handling: `server/src/middleware/error.middleware.ts` — error response format

**High Priority — Client:**
1. Custom hooks: `client/src/hooks/useAuth.ts`, `client/src/hooks/usePlayers.ts` — query/mutation logic
2. Form validation schemas: `client/src/schemas/playerSchemas.ts` and other schema files — Zod schema correctness
3. Route protection: `client/src/components/ProtectedRoutes.tsx` — role-based access

**Medium Priority:**
4. Server controllers: CRUD operations in `server/src/controllers/player.controller.ts` and peers
5. Client utility functions: `client/src/utils/formatStatLabel.ts`, `client/src/utils/positionToMarkers.ts`
6. Redux store: `client/src/store/authSlice.ts` — reducer logic

**Lower Priority:**
7. React components: Modal forms, cards, layout components
8. API instance: `client/src/api/axiosInstance.ts` — interceptor behavior

## Test File Placement (When Added)

**Co-located pattern (recommended for this codebase):**
```
client/src/hooks/usePlayers.ts
client/src/hooks/usePlayers.test.ts

server/src/controllers/player.controller.ts
server/src/controllers/player.controller.test.ts
```

**Alternatively, separate test directories:**
```
client/src/__tests__/hooks/usePlayers.test.ts
server/src/__tests__/controllers/player.controller.test.ts
```

## Validation Testing (Immediate Win)

The Zod schemas in `client/src/schemas/` are pure functions and easily testable without any mocking:

```typescript
// Example: client/src/schemas/playerSchemas.test.ts
import { describe, it, expect } from 'vitest';
import { playerFormSchema } from './playerSchemas';

describe('playerFormSchema', () => {
  it('should reject a player without a name', () => {
    const result = playerFormSchema.safeParse({ name: '', number: 1, position: 'GK', /* ... */ });
    expect(result.success).toBe(false);
  });

  it('should accept a valid player', () => {
    const result = playerFormSchema.safeParse({
      name: 'John Doe',
      number: 10,
      position: 'Forward',
      bio: 'A great player with skills',
      age: 25,
      dateOfBirth: '2001-01-01',
      gender: 'Male',
      stats: { appearances: 10 },
    });
    expect(result.success).toBe(true);
  });
});
```

## Hook Testing Pattern (When Framework Added)

```typescript
// Example: client/src/hooks/usePlayers.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import store from '../store';
import usePlayers from './usePlayers';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </Provider>
  );
};

describe('usePlayers', () => {
  it('should fetch players', async () => {
    const { result } = renderHook(() => usePlayers(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.playersLoading).toBe(false));
    expect(result.current.players).toBeDefined();
  });
});
```

## Server Controller Testing Pattern (When Framework Added)

```typescript
// Example: server/src/controllers/player.controller.test.ts
import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';

describe('GET /api/players', () => {
  it('should return 200 and a list of players', async () => {
    const res = await request(app).get('/api/players');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
```

## Coverage

**Requirements:** None enforced. No coverage tooling configured.

---

*Testing analysis: 2026-05-01*
