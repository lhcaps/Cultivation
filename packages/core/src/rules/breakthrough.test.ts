/**
 * Breakthrough rules tests — deterministic verification of realm advancement.
 */
import { describe, it, expect } from "vitest";
import {
  calculateBreakthroughRate,
  checkBreakthroughPrerequisites,
  resolveBreakthrough,
  getNextRealm,
} from "./breakthrough.js";
import type { CharacterState } from "../types/index.js";

function fixedRng(values: number[]): import("./breakthrough.js").Rng {
  let idx = 0;
  return { next: () => values[idx++ % values.length] ?? 0.5 };
}

function makeCharacter(overrides: Partial<CharacterState> = {}): CharacterState {
  return {
    id: "test-char",
    discordUserId: "test-user",
    name: "TestChar",
    realm: "LUYEN_THE",
    subStage: "SO",
    cultivationPoints: 3_000, // full realm
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

describe("getNextRealm", () => {
  it("returns next realm in order", () => {
    expect(getNextRealm("LUYEN_THE")).toBe("KHI_TUC");
    expect(getNextRealm("KHI_TUC")).toBe("LUYEN_HON");
    expect(getNextRealm("NGU_BAT_TON")).toBeNull();
  });
});

describe("calculateBreakthroughRate", () => {
  // Use a mix of penalties so bonuses can be observed without hitting 0.99 cap.
  // injuryLevel 1 + heartDemon 30 => rate ~0.845, leaving room for mode bonuses to differ.
  const baseChar = makeCharacter({ foundationQuality: 5, heartDemon: 30, injuryLevel: 1 });

  it("applies foundation quality bonus", () => {
    const lowFnd = makeCharacter({ foundationQuality: 5, heartDemon: 30, injuryLevel: 1 });
    const highFnd = makeCharacter({ foundationQuality: 30, heartDemon: 30, injuryLevel: 1 });
    const lowRate = calculateBreakthroughRate(lowFnd, "STABLE");
    const highRate = calculateBreakthroughRate(highFnd, "STABLE");
    expect(highRate).toBeGreaterThan(lowRate);
  });

  it("applies injury penalty", () => {
    const noInjury = makeCharacter({ injuryLevel: 0, foundationQuality: 5, heartDemon: 30 });
    const injured = makeCharacter({ injuryLevel: 2, foundationQuality: 5, heartDemon: 30 });
    const rateNoInjury = calculateBreakthroughRate(noInjury, "STABLE");
    const rateInjured = calculateBreakthroughRate(injured, "STABLE");
    expect(rateInjured).toBeLessThan(rateNoInjury);
  });

  it("applies PILL mode bonus over STABLE", () => {
    const stable = calculateBreakthroughRate(baseChar, "STABLE");
    const pill = calculateBreakthroughRate(baseChar, "PILL");
    expect(pill).toBeGreaterThan(stable);
  });

  it("applies SECT_FORMATION bonus over STABLE", () => {
    const stable = calculateBreakthroughRate(baseChar, "STABLE");
    const formation = calculateBreakthroughRate(baseChar, "SECT_FORMATION");
    expect(formation).toBeGreaterThan(stable);
  });

  it("clamps rate between 0.01 and 0.99", () => {
    const char = makeCharacter({ foundationQuality: 0, heartDemon: 100, injuryLevel: 10 });
    const rate = calculateBreakthroughRate(char, "FORCED");
    expect(rate).toBeGreaterThanOrEqual(0.01);
    expect(rate).toBeLessThanOrEqual(0.99);
  });
});

describe("checkBreakthroughPrerequisites", () => {
  it("fails when cultivation points insufficient", () => {
    const char = makeCharacter({ cultivationPoints: 0 });
    const result = checkBreakthroughPrerequisites(char);
    expect(result.valid).toBe(false);
    expect(result.reason).toContain("Tu vi chưa đầy");
  });

  it("fails when heart demon critical", () => {
    const char = makeCharacter({ heartDemon: 100, cultivationPoints: 3_000 });
    const result = checkBreakthroughPrerequisites(char);
    expect(result.valid).toBe(false);
    expect(result.reason).toContain("Tâm ma");
  });

  it("fails when injury severe", () => {
    const char = makeCharacter({ injuryLevel: 3, cultivationPoints: 3_000 });
    const result = checkBreakthroughPrerequisites(char);
    expect(result.valid).toBe(false);
    expect(result.reason).toContain("Thương");
  });

  it("fails when no manual", () => {
    const char = makeCharacter({ manualId: null, cultivationPoints: 3_000 });
    const result = checkBreakthroughPrerequisites(char);
    expect(result.valid).toBe(false);
    expect(result.reason).toContain("công pháp");
  });

  it("passes when all conditions met", () => {
    const char = makeCharacter({
      cultivationPoints: 3_000,
      heartDemon: 0,
      injuryLevel: 0,
      manualId: "THANH_VAN_QUYET",
    });
    const result = checkBreakthroughPrerequisites(char);
    expect(result.valid).toBe(true);
    expect(result.reason).toBeNull();
  });
});

describe("resolveBreakthrough", () => {
  it("throws when prerequisites not met", () => {
    const char = makeCharacter({ cultivationPoints: 0 });
    expect(() => resolveBreakthrough(char, "STABLE", fixedRng([0.5]))).toThrow();
  });

  it("succeeds with perfect RNG roll (force success)", () => {
    const char = makeCharacter();
    const result = resolveBreakthrough(char, "STABLE", fixedRng([0.0, 0.5]));
    expect(["SUCCESS", "CRITICAL_SUCCESS"]).toContain(result.outcome);
    expect(result.newRealm).toBe("KHI_TUC");
  });

  it("produces failure outcomes with low RNG roll", () => {
    // foundation=1, injury=1, heartDemon=20 => rate=0.802; thresholds: 0.762, 1.062 (capped)
    // Roll 0.85 >= 0.762 (success) FAIL; 0.85 < 1.062 (critical) PASS => MINOR_FAILURE
    const char = makeCharacter({ cultivationPoints: 3_000, foundationQuality: 1, injuryLevel: 1, heartDemon: 20 });
    const result = resolveBreakthrough(char, "STABLE", fixedRng([0.85, 0.5]));
    expect(result.outcome).toBe("MINOR_FAILURE");
  });

  it("applies extra injury on forced failure", () => {
    // Same char: FORCED rate=0.561; thresholds: 0.533, 0.833
    // Roll 0.9 >= 0.833 => SEVERE_FAILURE
    const char = makeCharacter({ cultivationPoints: 3_000, foundationQuality: 1, injuryLevel: 1, heartDemon: 20 });
    const result = resolveBreakthrough(char, "FORCED", fixedRng([0.9, 0.5]));
    expect(result.outcome).toBe("SEVERE_FAILURE");
    expect(result.injury).toBeGreaterThan(0);
  });

  it("caps at max realm gracefully", () => {
    const char = makeCharacter({ realm: "NGU_BAT_TON", cultivationPoints: 19_683_000 * 3 });
    const result = resolveBreakthrough(char, "STABLE", fixedRng([0.0, 0.5]));
    expect(result.outcome).toBe("CRITICAL_SUCCESS");
    expect(result.newRealm).toBe("NGU_BAT_TON");
  });
});
