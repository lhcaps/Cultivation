/**
 * Alchemy rules — pill quality calculation and fire control mechanics.
 */
import type {
  CharacterState,
  AlchemyResult,
  FireControlChoice,
  AlchemyRecipe,
} from "../types/index.js";

export const FIRE_CONTROL_CHOICES = {
  ROUND_1_IGNITE: {
    A: { label: "Tiểu Hỏa", stabilityMod: 10, purityMod: 0, outputMod: -5, qiCost: 5 },
    B: { label: "Trung Hỏa", stabilityMod: 5, purityMod: 0, outputMod: 0, qiCost: 10 },
    C: { label: "Đại Hỏa", stabilityMod: 0, purityMod: 5, outputMod: 10, qiCost: 20 },
  },
  ROUND_2_DISSOLVE: {
    A: { label: "Giữ nhiệt", stabilityMod: 5, purityMod: 0, outputMod: -5, qiCost: 5 },
    B: { label: "Tăng nhiệt", stabilityMod: 0, purityMod: 5, outputMod: 5, qiCost: 15 },
    C: { label: "Hạ nhiệt", stabilityMod: 10, purityMod: -5, outputMod: -10, qiCost: 5 },
  },
  ROUND_3_FILTER: {
    A: { label: "Ổn định", stabilityMod: 5, purityMod: 5, outputMod: 0, qiCost: 5 },
    B: { label: "Mạnh tay", stabilityMod: -5, purityMod: 10, outputMod: 10, qiCost: 20 },
    C: { label: "Dùng thần thức", stabilityMod: 0, purityMod: 5, outputMod: 5, qiCost: 25 },
  },
  ROUND_4_CONDENSE: {
    A: { label: "Nhanh", stabilityMod: -10, purityMod: 0, outputMod: 15, qiCost: 10 },
    B: { label: "Chậm", stabilityMod: 5, purityMod: 0, outputMod: -5, qiCost: 10 },
    C: { label: "Cực chậm", stabilityMod: 10, purityMod: 5, outputMod: -10, qiCost: 10 },
  },
  ROUND_5_OPEN: {
    A: { label: "Cưỡng khai", stabilityMod: -15, purityMod: 0, outputMod: 20, qiCost: 15 },
    B: { label: "Ổn khai", stabilityMod: 0, purityMod: 0, outputMod: 0, qiCost: 5 },
    C: { label: "Chờ thêm", stabilityMod: 10, purityMod: 5, outputMod: -10, qiCost: 0 },
  },
} as const;

export type RoundChoiceKey = "A" | "B" | "C";

/**
 * Calculate pill quality based on fire control choices and character stats.
 */
export function calculatePillQuality(
  character: CharacterState,
  recipe: AlchemyRecipe,
  choices: FireControlChoice[],
): { stability: number; purity: number; output: number } {
  let stability = recipe.baseStability;
  let purity = recipe.basePurity;
  let output = recipe.baseOutput;

  for (const choice of choices) {
    let roundConfig: (typeof FIRE_CONTROL_CHOICES)[keyof typeof FIRE_CONTROL_CHOICES][RoundChoiceKey] | null = null;

    if (choice.round === 1) {
      roundConfig = FIRE_CONTROL_CHOICES.ROUND_1_IGNITE[choice.choice] ?? null;
    } else if (choice.round === 2) {
      roundConfig = FIRE_CONTROL_CHOICES.ROUND_2_DISSOLVE[choice.choice] ?? null;
    } else if (choice.round === 3) {
      roundConfig = FIRE_CONTROL_CHOICES.ROUND_3_FILTER[choice.choice] ?? null;
    } else if (choice.round === 4) {
      roundConfig = FIRE_CONTROL_CHOICES.ROUND_4_CONDENSE[choice.choice] ?? null;
    } else if (choice.round === 5) {
      roundConfig = FIRE_CONTROL_CHOICES.ROUND_5_OPEN[choice.choice] ?? null;
    }

    if (roundConfig) {
      stability += roundConfig.stabilityMod;
      purity += roundConfig.purityMod;
      output += roundConfig.outputMod;
    }
  }

  // Apply character modifiers
  // Foundation quality bonus
  stability += character.foundationQuality * 0.3;
  // Region bonus (alchemy-focused regions)
  // TODO: Add region-based bonuses
  // Random variance: ±10
  stability += (Math.random() - 0.5) * 20;
  purity += (Math.random() - 0.5) * 10;
  output += (Math.random() - 0.5) * 20;

  return {
    stability: Math.max(0, Math.min(100, Math.round(stability))),
    purity: Math.max(0, Math.min(100, Math.round(purity))),
    output: Math.max(0, Math.min(100, Math.round(output))),
  };
}

/**
 * Determine pill quality tier from stability and purity.
 */
export function determinePillQuality(
  stability: number,
  purity: number,
): AlchemyResult["quality"] {
  if (stability >= 90 && purity >= 80) {
    return "CUC_PHAM";
  }
  if (stability >= 75 && purity >= 60) {
    return "THUONG_PHAM";
  }
  if (stability >= 50 && purity >= 40) {
    return "TRUNG_PHAM";
  }
  if (stability >= 25) {
    return "HA_PHAM";
  }
  return "THAT_BAI";
}

/**
 * Resolve an alchemy attempt.
 */
export function resolveAlchemy(
  character: CharacterState,
  recipe: AlchemyRecipe,
  choices: FireControlChoice[],
): AlchemyResult {
  // Check Qi
  const totalQiCost = choices.reduce((sum, c) => sum + c.qiCost, 0);
  if (character.currentQi < totalQiCost) {
    throw new Error("Qi không đủ để thực hiện luyện đan.");
  }

  const { stability, purity, output } = calculatePillQuality(character, recipe, choices);
  const quality = determinePillQuality(stability, purity);

  // Check for Đan Kiếp (Pill Tribulation)
  const danKiep = quality === "CUC_PHAM" && Math.random() < 0.05;
  let danKiepResult: "WIN" | "LOSE" | null = null;

  if (danKiep) {
    // Pill tribulation: higher realm = better chance
    const tribulationChance = Math.min(0.9, 0.5 + character.foundationQuality / 200);
    danKiepResult = Math.random() < tribulationChance ? "WIN" : "LOSE";
  }

  // Determine if ingredients are lost
  const ingredientsLost = quality === "THAT_BAI" || (danKiep && danKiepResult === "LOSE");

  // Public log conditions
  const publicLog =
    quality === "CUC_PHAM" || danKiep;

  let publicLogMessage: string | null = null;
  if (publicLog) {
    if (danKiep) {
      publicLogMessage = `⚡ ${character.name} gặp Đan Kiếp trong lúc luyện ${recipe.name}! ${
        danKiepResult === "WIN" ? "Đã vượt qua thành công!" : "Đã thất bại!"
      }`;
    } else {
      publicLogMessage = `🌟 ${character.name} luyện ra Cực Phẩm ${recipe.name}! Khí tức kinh thiên!`;
    }
  }

  return {
    quality,
    pillId: recipe.id,
    pillName: recipe.name,
    stability,
    purity,
    output,
    ingredientsLost,
    danKiep,
    danKiepResult,
    publicLog,
    publicLogMessage,
  };
}
