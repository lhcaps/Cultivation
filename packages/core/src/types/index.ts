import { z } from "zod";
import type { RealmId } from "../constants/realms.js";

/** Character sub-stage enum */
export const SubStage = z.enum(["SƠ", "TRUNG", "HẬU"]);
export type SubStage = z.infer<typeof SubStage>;

/** Cultivation mode enum */
export const CultivationMode = z.enum(["STABLE", "FORCED", "SECLUSION", "SECT"]);
export type CultivationMode = z.infer<typeof CultivationMode>;

/** Breakthrough mode enum */
export const BreakthroughMode = z.enum(["STABLE", "FORCED", "PILL", "SECT_FORMATION"]);
export type BreakthroughMode = z.infer<typeof BreakthroughMode>;

/** Region enum */
export const RegionId = z.enum([
  "DAI_VIET",
  "TRUNG_NGUYEN",
  "TAY_VUC",
  "U_MINH",
  "DONG_HAI",
  "BAC_MAC",
  "NAM_MAN",
  "CON_LON",
]);
export type RegionId = z.infer<typeof RegionId>;

/** Sect alignment enum */
export const SectAlignment = z.enum(["CHINH", "TA", "TRUNG"]);
export type SectAlignment = z.infer<typeof SectAlignment>;

/** Injury level */
export const InjuryLevel = z.number().int().min(0).max(4);
export type InjuryLevel = z.infer<typeof InjuryLevel>;

/** Core character snapshot — used for game engine input */
export interface CharacterState {
  id: string;
  discordUserId: string;
  name: string;
  realm: RealmId;
  subStage: SubStage;
  cultivationPoints: number;
  foundationQuality: number;
  heartDemon: number;
  injuryLevel: InjuryLevel;
  region: RegionId;
  sectId: string | null;
  manualId: string | null;
  /** Current HP (may be reduced by injury) */
  currentHp: number;
  /** Max HP (base, before injury penalty) */
  maxHp: number;
  currentQi: number;
  maxQi: number;
  silver: number;
  spiritStones: number;
  merit: number;
  reputation: number;
  heavenSeals: number;
  luck: number;
  /** Element affinity */
  element: ElementType;
  /** Date when cultivation points were last updated */
  lastCultivationAt: Date | null;
  /** Date when heart demon was last updated */
  lastHeartDemonAt: Date | null;
}

export const ElementType = z.enum(["KIM", "MOC", "THUY", "HOA", "THO"]);
export type ElementType = z.infer<typeof ElementType>;

/** Cultivation session result */
export interface CultivationResult {
  pointsGained: number;
  heartDemonGained: number;
  injury: InjuryLevel;
  spiritStonesGained: number;
  meridianBonus: boolean;
  stability: number;
  /** Whether to post public log */
  shouldPublicLog: boolean;
  /** Message for public log */
  publicLogMessage: string | null;
}

/** Breakthrough result */
export interface BreakthroughResult {
  outcome: "CRITICAL_SUCCESS" | "SUCCESS" | "MINOR_FAILURE" | "SEVERE_FAILURE";
  newRealm: RealmId | null;
  newSubStage: SubStage | null;
  foundationGain: number;
  cultivationPointsLoss: number;
  heartDemonGain: number;
  injury: InjuryLevel;
  cooldownDays: number;
  publicLog: boolean;
  publicLogMessage: string | null;
  hiddenPotentialUnlocked: boolean;
}

/** Alchemy result */
export interface AlchemyResult {
  quality: "THAT_BAI" | "HA_PHAM" | "TRUNG_PHAM" | "THUONG_PHAM" | "CUC_PHAM";
  pillId: string;
  pillName: string;
  stability: number;
  purity: number;
  output: number;
  ingredientsLost: boolean;
  danKiep: boolean;
  danKiepResult: "WIN" | "LOSE" | null;
  publicLog: boolean;
  publicLogMessage: string | null;
}

/** Fire control choice */
export interface FireControlChoice {
  round: 1 | 2 | 3 | 4 | 5;
  choice: "A" | "B" | "C";
  stabilityMod: number;
  purityMod: number;
  outputMod: number;
  qiCost: number;
}

/** Alchemy recipe definition */
export interface AlchemyRecipe {
  id: string;
  name: string;
  difficulty: "EASY" | "MEDIUM" | "HARD" | "EXPERT";
  requiredIngredients: { itemId: string; quantity: number }[];
  spiritStoneCost: number;
  baseStability: number;
  basePurity: number;
  baseOutput: number;
  difficultyBonus: number;
  description: string;
}

/** Combat result */
export interface CombatResult {
  winner: "attacker" | "defender";
  turns: number;
  attackerHpRemaining: number;
  defenderHpRemaining: number;
  damageDealt: number;
  damageTaken: number;
  criticalHits: number;
  loot: {
    silver: number;
    spiritStones: number;
    items: string[];
  };
  rewards: {
    cultivationPoints: number;
    reputation: number;
    merit: number;
  };
  penalties: {
    injury: InjuryLevel;
    cultivationLoss: number;
    heartDemonGain: number;
    deathCheck: boolean;
  };
  combatLog: string[];
}

/** Encounter choice */
export interface EncounterChoice {
  label: string;
  effects: {
    cultivationPoints?: number;
    silver?: number;
    spiritStones?: number;
    reputation?: number;
    merit?: number;
    heartDemon?: number;
    reputationFaction?: Record<string, number>;
    riskInjuryChance?: number;
    luckBonus?: number;
    itemGain?: string[];
  };
}

/** Encounter definition */
export interface EncounterDefinition {
  id: string;
  region: RegionId;
  requiredRealmMin: RealmId;
  requiredRealmMax: RealmId;
  weight: number;
  title: string;
  description: string;
  choices: EncounterChoice[];
}

/** Sect state */
export interface SectState {
  id: string;
  name: string;
  alignment: SectAlignment;
  rank: 1 | 2 | 3 | 4 | 5;
  treasury: number;
  memberCount: number;
  headquartersRegion: RegionId;
  benefits: string[];
  isInviteOnly: boolean;
  warDeclarations: string[];
}

/** Admin action type */
export const AdminActionType = z.enum([
  "PLAYER_BAN",
  "PLAYER_UNBAN",
  "PLAYER_MUTE",
  "PLAYER_KICK",
  "PLAYER_RESET",
  "PLAYER_DELETE",
  "PLAYER_TELEPORT",
  "ITEM_GIVE",
  "ITEM_GIVE_BULK",
  "ITEM_REMOVE",
  "CURRENCY_SET",
  "CURRENCY_ADD",
  "EVENT_CREATE",
  "EVENT_MODIFY",
  "EVENT_END",
  "BOSS_SPAWN",
  "BOSS_DESPAWN",
  "SECT_CREATE",
  "SECT_DISSOLVE",
  "SECT_PROMOTE",
  "SECT_SET_LEADER",
  "SECT_TREASURY_MODIFY",
  "SECT_WAR_DECLARE",
  "ECONOMY_ADJUST",
  "ECONOMY_SET_RATE",
  "WORLD_CONFIG_CHANGE",
  "ANNOUNCEMENT",
  "WHISPER",
  "REVIVAL",
]);
export type AdminActionType = z.infer<typeof AdminActionType>;
