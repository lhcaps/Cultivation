/**
 * Cultivation rules tests — deterministic verification of game engine.
 */
import { describe, it, expect } from "vitest";
import {
  calculateCultivationGain,
  resolveCultivation,
  canCultivate,
  getSeasonalMultiplier,
  getHeartDemonPenalty,
  type Rng,
} from "./cultivation.js";
import type { CharacterState } from "../types/index.js";

/** Fixed RNG for deterministic tests — cycles through provided values. */
function fixedRng(values: number[]): Rng {
  let idx = 0;
  return { next: () => values[idx++ % values.length] ?? 0.5 };
}

/** Minimal character state for testing — cooldown-safe. */
function makeCharacter(overrides: Partial<CharacterState> = {}): CharacterState {
  return {
    id: "test-char",
    discordUserId: "test-user",
    name: "TestChar",
    realm: "LUYEN_THE",
    subStage: "SO",
    cultivationPoints: 0,
    foundationQuality: 20,
    heartDemon: 0,
    injuryLevel: 0,
    region: "DAI_VIET",
    sectId: null,
    manualId: "THANH_VAN_QUYET",
    currentHp: 100,
    maxHp: 100,
    currentQi: 50,
    maxQi: 50,
    silver: 500,
    spiritStones: 0,
    merit: 0,
    reputation: 0,
    heavenSeals: 0,
    luck: 10,
    element: "THUY",
    lastCultivationAt: null,
    lastHeartDemonAt: null,
    ...overrides,
  };
}

/**
 * Cooldown-safe character for cultivation tests.
 * resolveCultivation calls RNG 3 times in order: (1) cultivation variance,
 * (2) injury check, (3) spirit stones. Position the trigger value correctly.
 */
function freshCultivator(cooldownHoursAgo = 24): CharacterState {
  return makeCharacter({
    lastCultivationAt: new Date(Date.now() - cooldownHoursAgo * 3_600_000),
  });
}

describe("calculateCultivationGain", () => {
  it("returns deterministic value with fixed RNG", () => {
    const char = makeCharacter({ realm: "LUYEN_THE", foundationQuality: 20, heartDemon: 0 });
    const rng = fixedRng([0.5]); // neutral variance
    // base: 1000 * 0.8 (STABLE) * 1.0 (region) * 1.0 (foundation: 1 + (20-20)/100) * 1.0 (heartDemon) * 1.10 (manual) * 1.0 (sect) = 880
    // variance: 0.9 + 0.5 * 0.2 = 1.0 => 880
    const gain = calculateCultivationGain(char.realm, "STABLE", char.foundationQuality, char.region, char.heartDemon, true, null, rng);
    expect(gain).toBe(880);
  });

  it("applies heart demon penalty", () => {
    const rng = fixedRng([0.5]);
    const base = calculateCultivationGain("LUYEN_THE", "STABLE", 20, "DAI_VIET", 0, false, null, rng);
    const withPenalty = calculateCultivationGain("LUYEN_THE", "STABLE", 20, "DAI_VIET", 50, false, null, rng);
    expect(withPenalty).toBeLessThan(base);
  });

  it("applies region multiplier (U_MINH)", () => {
    const rng = fixedRng([0.5]);
    const normal = calculateCultivationGain("LUYEN_THE", "STABLE", 20, "DAI_VIET", 0, false, null, rng);
    const uminh = calculateCultivationGain("LUYEN_THE", "STABLE", 20, "U_MINH", 0, false, null, rng);
    expect(uminh).toBeGreaterThan(normal);
  });

  it("applies seasonal multiplier (summer)", () => {
    const normal = getSeasonalMultiplier(6); // June
    expect(normal).toBeGreaterThan(1.0);
  });

  it("applies winter penalty", () => {
    const winter = getSeasonalMultiplier(1); // January
    expect(winter).toBeLessThan(1.0);
  });

  it("heart demon penalty thresholds", () => {
    expect(getHeartDemonPenalty(0)).toBe(1.00);
    expect(getHeartDemonPenalty(19)).toBe(1.00);
    expect(getHeartDemonPenalty(20)).toBe(0.95);
    expect(getHeartDemonPenalty(49)).toBe(0.95);
    expect(getHeartDemonPenalty(50)).toBe(0.85);
    expect(getHeartDemonPenalty(79)).toBe(0.85);
    // 80 is >= HEART_DEMON_CRITICAL (80), so falls through to 0.40
    expect(getHeartDemonPenalty(80)).toBe(0.40);
    expect(getHeartDemonPenalty(100)).toBe(0.40);
  });
});

describe("resolveCultivation", () => {
  it("returns points gained on successful cultivation", () => {
    const char = freshCultivator();
    const rng = fixedRng([0.5, 0.5, 0.5]); // variance, injury, spirit stones
    const result = resolveCultivation(char, "STABLE", null, rng);
    expect(result.pointsGained).toBeGreaterThan(0);
  });

  it("can create injury from forced cultivation", () => {
    // RNG order in resolveCultivation: (1) variance, (2) injury trigger, (3) spirit stones
    const char = freshCultivator();
    const rngInjury = fixedRng([0.5, 0.05, 0.5]); // (2) 0.05 < 0.12 => injury
    const resultInjury = resolveCultivation(char, "FORCED", null, rngInjury);
    expect(resultInjury.injury).toBe(1);

    const charSafe = freshCultivator();
    const rngSafe = fixedRng([0.5, 0.99, 0.5]); // (2) 0.99 >= 0.12 => no injury
    const resultSafe = resolveCultivation(charSafe, "FORCED", null, rngSafe);
    expect(resultSafe.injury).toBe(0);
  });

  it("respects cooldown — throws after recent cultivation", () => {
    const char = makeCharacter({ lastCultivationAt: new Date() }); // just now
    expect(() => resolveCultivation(char, "STABLE", null, fixedRng([0.5]))).toThrow();
  });

  it("respects cooldown — does not throw after cooldown period", () => {
    const char = makeCharacter({ lastCultivationAt: new Date(Date.now() - 25 * 3_600_000) });
    expect(() => resolveCultivation(char, "STABLE", null, fixedRng([0.5, 0.5, 0.5]))).not.toThrow();
  });

  it("always returns heart demon gained", () => {
    const char = makeCharacter({ lastCultivationAt: new Date(Date.now() - 86400_000 * 2) });
    const result = resolveCultivation(char, "STABLE", null, fixedRng([0.5]));
    expect(result.heartDemonGained).toBeGreaterThanOrEqual(0);
  });
});

describe("canCultivate", () => {
  it("throws on severe injury (level 4)", () => {
    const char = makeCharacter({ injuryLevel: 4 });
    expect(() => canCultivate(char, "STABLE")).toThrow("Trọng thương");
  });

  it("throws on critical heart demon (>= 100)", () => {
    const char = makeCharacter({ heartDemon: 100 });
    expect(() => canCultivate(char, "STABLE")).toThrow("Tâm ma bùng phát");
  });

  it("throws on SECT mode without sect membership", () => {
    const char = makeCharacter({ sectId: null });
    expect(() => canCultivate(char, "SECT")).toThrow("Cần gia nhập tông môn");
  });

  it("does not throw when all conditions are met", () => {
    const char = makeCharacter({ injuryLevel: 0, heartDemon: 0, sectId: null });
    expect(() => canCultivate(char, "STABLE")).not.toThrow();
  });
});
