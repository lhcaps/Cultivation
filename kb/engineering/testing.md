# Testing Strategy — Thiên Nam Engine

> How testing is organized and what coverage targets mean.

---

## Coverage Targets

| Package | Target | What's Tested |
|---------|--------|-------------|
| `packages/core` | **90%** | Every rule function |
| `apps/api` | **70%** | Service methods |
| `apps/worker` | **60%** | Job handlers |

---

## Test Organization

```
packages/core/src/rules/
├── cultivation.test.ts
├── breakthrough.test.ts
├── alchemy.test.ts
└── __fixtures__/
    ├── character-state.ts
    └── realm-data.ts
```

---

## Test Types

### Unit Tests (packages/core)

Every rule function needs:

1. Happy path test
2. Edge case tests (zero, max, boundary)
3. Error case tests
4. Formula verification

### Integration Tests (apps/api)

Service methods with mocked Prisma:

```typescript
vi.mock("../../src/prisma.service.js");
const mockPrisma = { character: { findUnique: vi.fn() } };
```

---

## Running Tests

```bash
pnpm test              # All
pnpm test:coverage     # With coverage
pnpm test:watch        # Watch mode
```

---

## CI Gate

PRs require all tests passing. Coverage must not decrease.
