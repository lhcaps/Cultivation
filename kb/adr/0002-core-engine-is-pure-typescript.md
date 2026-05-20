# Architecture Decision Record 0002 — Core Engine is Pure TypeScript

## Status

Accepted

## Context

The game engine needed to be:
1. Testable without mocking Discord, NestJS, or Prisma
2. Portable (usable by multiple clients)
3. Fast to iterate on (no framework overhead)

## Decision

`packages/core` contains all game rules as pure TypeScript functions. Zero external dependencies (only Zod for validation schemas).

## Consequences

### Positive

- Pure functions = easy to test (just pass input, check output)
- No mocking required
- Can run calculations in browser, worker, or server
- Bundle size is tiny (target < 50KB gzipped)
- Team can work on game balance without touching infrastructure

### Negative

- Strict boundaries between core and data layer
- Serialization overhead (Prisma → plain object → core → result → plain object → Prisma)
- Must maintain two TypeScript packages

## Implementation Rules

```typescript
// ✅ Right
export function calculateCultivationGain(
  realm: RealmId,
  mode: CultivationMode,
  foundationQuality: number,
): number { /* pure calculation */ }

// ❌ Wrong
export async function calculateCultivationGain(
  characterId: string,
): Promise<number> {
  const char = await prisma.character.findUnique({ where: { id: characterId } });
  // ... too coupled
}
```

---

*Decision made: 2024-01-01*
