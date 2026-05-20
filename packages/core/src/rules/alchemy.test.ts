/**
 * Alchemy rules tests — deterministic verification of pill quality calculation.
 */
import { describe, it, expect } from "vitest";
import {
  calculatePillQuality,
  determinePillQuality,
  resolveAlchemy,
  FIRE_CONTROL_CHOICES,
} from "./alchemy.js";
import type { CharacterState, AlchemyRecipe, FireControlChoice } from "../types/index.js";

function fixedRng(values: number[]): import("./alchemy.js").Rng {
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

function makeRecipe(overrides: Partial<AlchemyRecipe> = {}): AlchemyRecipe {
  return {
    id: "test-pill",
    name: "Test Pill",
    difficulty: "EASY",
    requiredIngredients: [],
    spiritStoneCost: 0,
    baseStability: 50,
    basePurity: 30,
    baseOutput: 40,
    difficultyBonus: 0,
    description: "A test pill",
    ...overrides,
  };
}

describe("FIRE_CONTROL_CHOICES", () => {
  it("has exactly 5 rounds", () => {
    expect(Object.keys(FIRE_CONTROL_CHOICES)).toHaveLength(5);
  });

  it("has A, B, C choices per round", () => {
    for (const round of Object.values(FIRE_CONTROL_CHOICES)) {
      expect(round).toHaveProperty("A");
      expect(round).toHaveProperty("B");
      expect(round).toHaveProperty("C");
    }
  });
});

describe("calculatePillQuality", () => {
  it("applies fire control modifiers from choices", () => {
    const recipe = makeRecipe({ baseStability: 50, basePurity: 30, baseOutput: 40 });
    const char = makeCharacter({ foundationQuality: 20 });
    const rng = fixedRng([0.5, 0.5, 0.5]);

    // All A choices: Tiểu Hỏa (stability +10), Giữ nhiệt (stability +5), Ổn định (stability +5)
    // Cực chậm (stability +10), Chờ thêm (stability +10)
    const choices: FireControlChoice[] = [
      { round: 1, choice: "A", stabilityMod: 10, purityMod: 0, outputMod: -5, qiCost: 5 },
      { round: 2, choice: "A", stabilityMod: 5, purityMod: 0, outputMod: -5, qiCost: 5 },
      { round: 3, choice: "A", stabilityMod: 5, purityMod: 5, outputMod: 0, qiCost: 5 },
      { round: 4, choice: "C", stabilityMod: 10, purityMod: 5, outputMod: -10, qiCost: 10 },
      { round: 5, choice: "C", stabilityMod: 10, purityMod: 5, outputMod: -10, qiCost: 0 },
    ];

    const result = calculatePillQuality(char, recipe, choices, rng);
    expect(result.stability).toBeGreaterThan(0);
    expect(result.purity).toBeGreaterThan(0);
    expect(result.output).toBeGreaterThanOrEqual(0);
  });

  it("applies foundation quality bonus to stability", () => {
    const recipe = makeRecipe({ baseStability: 50 });
    const lowFnd = makeCharacter({ foundationQuality: 10 });
    const highFnd = makeCharacter({ foundationQuality: 80 });
    const rng = fixedRng([0.5, 0.5, 0.5]);
    const low = calculatePillQuality(lowFnd, recipe, [], rng);
    const high = calculatePillQuality(highFnd, recipe, [], rng);
    expect(high.stability).toBeGreaterThan(low.stability);
  });

  it("clamps results between 0 and 100", () => {
    const recipe = makeRecipe({ baseStability: 200 });
    const char = makeCharacter();
    const rng = fixedRng([0.5, 0.5, 0.5]);
    const result = calculatePillQuality(char, recipe, [], rng);
    expect(result.stability).toBeLessThanOrEqual(100);
    expect(result.purity).toBeLessThanOrEqual(100);
    expect(result.output).toBeLessThanOrEqual(100);
  });
});

describe("determinePillQuality", () => {
  it("returns CUC_PHAM for high stability + purity", () => {
    expect(determinePillQuality(90, 80)).toBe("CUC_PHAM");
    expect(determinePillQuality(95, 90)).toBe("CUC_PHAM");
  });

  it("returns THUONG_PHAM for good quality", () => {
    expect(determinePillQuality(75, 60)).toBe("THUONG_PHAM");
  });

  it("returns TRUNG_PHAM for medium quality", () => {
    expect(determinePillQuality(50, 40)).toBe("TRUNG_PHAM");
  });

  it("returns HA_PHAM for low stability", () => {
    expect(determinePillQuality(25, 10)).toBe("HA_PHAM");
  });

  it("returns THAT_BAI for very low stability", () => {
    expect(determinePillQuality(10, 5)).toBe("THAT_BAI");
  });
});

describe("resolveAlchemy", () => {
  it("throws when Qi insufficient", () => {
    const char = makeCharacter({ currentQi: 5 });
    const recipe = makeRecipe();
    const choices: FireControlChoice[] = [
      { round: 1, choice: "C", stabilityMod: 0, purityMod: 5, outputMod: 10, qiCost: 20 },
    ];
    expect(() => resolveAlchemy(char, recipe, choices, fixedRng([0.5]))).toThrow("Qi không đủ");
  });

  it("returns that bai when stability is low", () => {
    const char = makeCharacter({ currentQi: 100, foundationQuality: 5 });
    const recipe = makeRecipe({ baseStability: 5, basePurity: 5, baseOutput: 5 });
    const result = resolveAlchemy(char, recipe, [], fixedRng([0.5, 0.5, 0.5]));
    expect(result.quality).toBe("THAT_BAI");
    expect(result.ingredientsLost).toBe(true);
  });

  it("marks ingredients as lost on failure", () => {
    const char = makeCharacter({ currentQi: 100, foundationQuality: 5 });
    const recipe = makeRecipe({ baseStability: 5 });
    const result = resolveAlchemy(char, recipe, [], fixedRng([0.5, 0.5, 0.5]));
    expect(result.ingredientsLost).toBe(true);
  });

  it("marks ingredients as kept on success", () => {
    const char = makeCharacter({ currentQi: 100, foundationQuality: 80 });
    const recipe = makeRecipe({ baseStability: 80, basePurity: 80 });
    const result = resolveAlchemy(char, recipe, [], fixedRng([0.5, 0.5, 0.5]));
    expect(result.ingredientsLost).toBe(false);
  });

  it("can trigger Đan Kiếp on CUC_PHAM with lucky RNG", () => {
    // rng[0] < 0.05 triggers danKiep; rng[1] < tribulationChance determines win/lose
    const char = makeCharacter({ currentQi: 100, foundationQuality: 80 });
    const recipe = makeRecipe({ baseStability: 95, basePurity: 95 });
    // rng[0]=0.03 < 0.05 => danKiep; rng[1]=0.1 < tribulationChance => WIN
    // rng[0-2] for stability/purity/output variance, rng[3] < 0.05 triggers danKiep, rng[4] for tribulation
    const result = resolveAlchemy(char, recipe, [], fixedRng([0.5, 0.5, 0.5, 0.03, 0.1]));
    expect(result.quality).toBe("CUC_PHAM");
    expect(result.danKiep).toBe(true);
  });
});
