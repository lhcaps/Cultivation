---
name: game-engine-engineer
description: Builds game rules in packages/core as pure TypeScript functions for Thiên Nam Engine.
---

# Skill: Game Engine Engineer

## Purpose

Builds and maintains the game engine in `packages/core`: pure TypeScript functions implementing game rules, formulas, and balance. The engine has zero external dependencies and is fully testable.

## When to Use

- Implementing a new game system (e.g., combat, crafting, exploration)
- Adding a new cultivation mode or breakthrough mechanic
- Modifying balance formulas
- Writing unit tests for core rules
- Refactoring existing rules for clarity or performance

## Inputs Expected

- Game system to implement (e.g., "combat system", "crafting", "exploration")
- Input types (what data the function needs)
- Output types (what the function returns)
- Formula or algorithm (or need to derive it)
- Existing constants in `packages/core/src/constants/`

## Workflow

### 1. Plan the Interface

1. Read `packages/core/src/types/index.ts` for existing type patterns
2. Read `packages/core/src/constants/` for relevant constants
3. Define input and output types:

```typescript
// Input type
interface CultivationInput {
  characterId: string;
  realm: RealmId;
  subStage: SubStageId;
  mode: CultivationMode;
  foundationQuality: number;
  region: RegionId;
  heartDemon: number;
  hasManual: boolean;
  inSect: boolean;
}

// Output type
interface CultivationResult {
  pointsGained: number;
  heartDemonGained: number;
  injury: InjuryLevel;
  spiritStonesGained: number;
  stability: number;
  shouldPublicLog: boolean;
  publicLogMessage: string | null;
}
```

### 2. Check for Existing Functions

```bash
grep -r "calculateCultivation" packages/core/src/
```

Reuse existing functions rather than duplicating logic.

### 3. Implement

1. Create file at `packages/core/src/rules/[system].ts`
2. Import types from `../types/index.ts`
3. Import constants from `../constants/index.ts`
4. Implement pure function:

```typescript
export function calculateCultivationGain(
  realm: RealmId,
  mode: CultivationMode,
  foundationQuality: number,
  region: RegionId,
  heartDemon: number,
  hasManual: boolean,
  inSect: boolean,
): number {
  const base = CULTIVATION_CONSTANTS.BASE_EXP_PER_SESSION[realm];
  const modeMultiplier = CULTIVATION_CONSTANTS.MODE_MULTIPLIERS[mode];
  const fqMultiplier = foundationQuality / 100; // 0.2 to 1.5
  const hdPenalty = Math.max(0, (heartDemon - 20) * 0.005);
  const manualBonus = hasManual ? 1.1 : 1.0;
  const sectBonus = inSect ? 1.05 : 1.0;
  const regionQi = getRegionQiMultiplier(region);

  return Math.floor(
    base * modeMultiplier * fqMultiplier * (1 - hdPenalty) * manualBonus * sectBonus * regionQi
  );
}
```

### 4. Add Zod Schema

```typescript
import { z } from "zod";

export const CultivationInputSchema = z.object({
  realm: z.enum(["LUYEN_THE", "KHI_TUC", "LUYEN_HON", "TRUC_MACH", "KIM_DAN"]),
  mode: z.enum(["STABLE", "FORCED", "SECLUSION", "SECT"]),
  foundationQuality: z.number().min(0).max(100),
  region: z.string(),
  heartDemon: z.number().min(0).max(100),
  hasManual: z.boolean(),
  inSect: z.boolean(),
});
```

### 5. Add Error Types

```typescript
export class CultivationError extends Error {
  constructor(
    message: string,
    public readonly code: "COOLDOWN_ACTIVE" | "INVALID_MODE" | "INJURY_BLOCKED" | "HEART_DEMON_CRITICAL"
  ) {
    super(message);
    this.name = "CultivationError";
  }
}
```

### 6. Write Tests

1. Create file at `packages/core/src/rules/[system].test.ts`
2. Test happy path
3. Test edge cases (zero, max, boundary)
4. Test error cases
5. Verify formulas mathematically

```typescript
import { describe, it, expect } from "vitest";
import { calculateCultivationGain } from "./cultivation.js";

describe("calculateCultivationGain", () => {
  it("returns base gain for stable cultivation at Luyện Thể", () => {
    const gain = calculateCultivationGain("LUYEN_THE", "STABLE", 50, "DAI_VIET", 0, false, false);
    expect(gain).toBeGreaterThan(0);
  });
});
```

### 7. Re-export

Add to `packages/core/src/rules/index.ts` and `packages/core/src/index.ts`.

## Output Format

- `packages/core/src/rules/[system].ts` — Pure function implementation
- `packages/core/src/rules/[system].test.ts` — Unit tests
- `packages/core/src/rules/index.ts` — Updated re-exports
- `packages/core/src/index.ts` — Updated re-exports

## Quality Bar

- Zero side effects (no DB, no network, no logging)
- Zero imports from discord.js, Prisma, NestJS
- All inputs typed, Zod schema for validation
- Returns serializable result object
- Throws typed errors with error codes
- Unit tests with >80% coverage
- Formula verified mathematically
- Accepts RNG as optional parameter for testable randomness
- Re-exported from index.ts

## Anti-Patterns

- Importing discord.js, Prisma, or NestJS
- Using `Math.random()` without injection
- Returning non-serializable objects
- Forgetting to add Zod schema
- Not throwing typed errors
- Writing business logic without tests
- Creating globals or singletons
- Using Date.now() without injection

## Related Files

- `packages/core/src/rules/`
- `packages/core/src/types/index.ts`
- `packages/core/src/constants/`
- `packages/core/src/calculators/`
- `.cursor/rules/030-game-engine-core.mdc`
- `.cursor/rules/070-testing-and-review.mdc`
