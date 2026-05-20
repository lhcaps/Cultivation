---
name: testing-reviewer
description: Reviews test coverage, writes unit and integration tests, and verifies code correctness for Thiên Nam Engine.
---

# Skill: Testing Reviewer

## Purpose

Reviews test coverage, writes unit and integration tests, and verifies code correctness for Thiên Nam Engine. Applies TDD principles for game engine and integration testing for API services.

## When to Use

- Reviewing PRs for test coverage
- Writing unit tests for `packages/core`
- Writing integration tests for `apps/api` services
- Verifying test coverage meets targets
- Identifying untested code paths
- Writing regression tests for bug fixes

## Inputs Expected

- File(s) to test or review
- Coverage target for the package
- Whether the feature is new (TDD) or existing (coverage gap)

## Workflow

### Review Mode

1. Read the file to review
2. Run coverage report: `pnpm --filter @thien-nam/core test:coverage`
3. Identify untested functions
4. Check for edge cases not covered
5. Write findings report:

```
## Coverage Report: [file]

### Functions
- `calculateCultivationGain`: [PASS/FAIL] — [coverage %]
  - Happy path: [tested/not tested]
  - Edge cases: [tested/not tested]
  - Error cases: [tested/not tested]

### Gaps
- [function]: Missing [edge case] test
- [function]: Missing error case test

### Recommendations
- Add test for [specific case]
- Verify formula [X] matches expected value
```

### Unit Test for Core

1. Read the function to test
2. Read `packages/core/src/__fixtures__/` for existing fixtures
3. Write tests following pattern:

```typescript
import { describe, it, expect, vi } from "vitest";
import { calculateCultivationGain } from "./cultivation.js";
import type { CharacterState } from "../types/index.js";

describe("calculateCultivationGain", () => {
  // Fixture helper
  const makeCharacter = (overrides: Partial<CharacterState> = {}): CharacterState => ({
    id: "test-char",
    realm: "LUYEN_THE",
    cultivationPoints: 0,
    foundationQuality: 20,
    heartDemon: 0,
    region: "DAI_VIET",
    sectId: null,
    manualId: null,
    // ... all required fields
    ...overrides,
  });

  describe("STABLE mode", () => {
    it("returns base gain for standard conditions", () => {
      const char = makeCharacter({ foundationQuality: 50 });
      const gain = calculateCultivationGain(char, "STABLE");
      // Luyện Thể base = 1000 × 0.8 × 1.0 × 1.0 × 1.0 × 1.0 = 800
      expect(gain).toBeGreaterThan(700);
      expect(gain).toBeLessThan(900);
    });

    it("increases with higher foundation quality", () => {
      const lowFQ = makeCharacter({ foundationQuality: 20 });
      const highFQ = makeCharacter({ foundationQuality: 80 });
      expect(calculateCultivationGain(highFQ, "STABLE"))
        .toBeGreaterThan(calculateCultivationGain(lowFQ, "STABLE"));
    });

    it("decreases with high heart demon", () => {
      const normal = makeCharacter({ heartDemon: 0 });
      const corrupted = makeCharacter({ heartDemon: 90 });
      expect(calculateCultivationGain(corrupted, "STABLE"))
        .toBeLessThan(calculateCultivationGain(normal, "STABLE"));
    });
  });

  describe("error cases", () => {
    it("throws for invalid mode", () => {
      expect(() =>
        calculateCultivationGain(makeCharacter(), "INVALID" as never)
      ).toThrow();
    });
  });
});
```

### Integration Test for API

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CharacterService } from "./character.service.js";

vi.mock("../../prisma/prisma.service.js");

describe("CharacterService", () => {
  let service: CharacterService;
  let mockPrisma: PrismaService;

  beforeEach(() => {
    mockPrisma = {
      character: {
        findUnique: vi.fn(),
        update: vi.fn(),
      },
    } as unknown as PrismaService;
    service = new CharacterService(mockPrisma);
  });

  it("returns character with relations", async () => {
    const mockChar = { id: "test", name: "Test" };
    vi.mocked(mockPrisma.character.findUnique).mockResolvedValue(mockChar);
    const result = await service.findById("test");
    expect(result).toEqual(mockChar);
  });
});
```

### RNG Testing

For testable randomness:

```typescript
// Deterministic RNG
let rollIndex = 0;
const deterministicRng = () => {
  const values = [0.95, 0.30, 0.05]; // success, minor fail, severe fail
  return values[rollIndex++ % values.length]!;
};

const result = resolveBreakthrough(state, "STABLE", { rng: deterministicRng });
```

## Output Format

- Test file at `packages/core/src/rules/[file].test.ts` or `apps/api/src/[module]/[service].test.ts`
- Coverage report (if review mode)
- Gap analysis report (if review mode)
- Regression test for bug fix

## Quality Bar

- >80% coverage for `packages/core` rules
- >70% coverage for `apps/api` services
- >60% coverage for `apps/worker` job handlers
- All happy paths tested
- All edge cases tested (zero, max, boundary)
- All error cases tested
- Deterministic RNG for reproducible tests
- Tests follow Arrange-Act-Assert pattern

## Anti-Patterns

- Tests without assertions (empty tests)
- Tests that only test happy path
- Tests that mock everything (no real logic tested)
- Tests that assert exact floating-point values
- Tests that don't use fixtures (duplicate setup)
- Commented-out tests
- Tests that don't run (broken imports)
- Mocking core functions instead of testing them directly

## Related Files

- `packages/core/src/rules/*.test.ts`
- `apps/api/src/*/*.test.ts`
- `packages/core/src/__fixtures__/`
- `.cursor/rules/070-testing-and-review.mdc`
- `.cursor/rules/030-game-engine-core.mdc`
