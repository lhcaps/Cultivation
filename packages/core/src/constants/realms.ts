/**
 * Realm constants — defines all 10 cultivation realms.
 * Realm order, sub-stages, and point requirements are game-critical.
 */
export const REALM_ORDER = [
  "LUYEN_THE",
  "KHI_TUC",
  "LUYEN_HON",
  "TRUC_MACH",
  "KIM_DAN",
  "NGUYEN_ANH",
  "HOA_THAN",
  "TRU_THAN",
  "DAI_THUA",
  "NGU_BAT_TON",
] as const;

export type RealmId = (typeof REALM_ORDER)[number];

export interface RealmDefinition {
  id: RealmId;
  name: string;
  nameLatin: string;
  subStages: ["SƠ", "TRUNG", "HẬU"] as const;
  /** Cultivation points needed per sub-stage */
  pointsPerSubStage: number;
  /** Base breakthrough success rate (0-1) */
  baseBreakthroughRate: number;
  /** Foundation quality minimum for stable breakthrough */
  foundationMin: number;
  /** Unlock notes */
  description: string;
}

export const REALMS: Record<RealmId, RealmDefinition> = {
  LUYEN_THE: {
    id: "LUYEN_THE",
    name: "Luyện Thể",
    nameLatin: "Mortality",
    subStages: ["SƠ", "TRUNG", "HẬU"],
    pointsPerSubStage: 1_000,
    baseBreakthroughRate: 1.0,
    foundationMin: 0,
    description: "The first realm where mortals sense Qi and begin cultivation.",
  },
  KHI_TUC: {
    id: "KHI_TUC",
    name: "Khí Tức",
    nameLatin: "Breath",
    subStages: ["SƠ", "TRUNG", "HẬU"],
    pointsPerSubStage: 3_000,
    baseBreakthroughRate: 0.95,
    foundationMin: 5,
    description: "Learning to circulate Qi through meridians.",
  },
  LUYEN_HON: {
    id: "LUYEN_HON",
    name: "Luyện Hồn",
    nameLatin: "Soul",
    subStages: ["SƠ", "TRUNG", "HẬU"],
    pointsPerSubStage: 9_000,
    baseBreakthroughRate: 0.90,
    foundationMin: 10,
    description: "The soul is refined, granting spiritual perception.",
  },
  TRUC_MACH: {
    id: "TRUC_MACH",
    name: "Trúc Mạch",
    nameLatin: "Foundation",
    subStages: ["SƠ", "TRUNG", "HẬU"],
    pointsPerSubStage: 27_000,
    baseBreakthroughRate: 0.85,
    foundationMin: 15,
    description: "Establishing a permanent foundation for power.",
  },
  KIM_DAN: {
    id: "KIM_DAN",
    name: "Kim Đan",
    nameLatin: "Gold Core",
    subStages: ["SƠ", "TRUNG", "HẬU"],
    pointsPerSubStage: 81_000,
    baseBreakthroughRate: 0.75,
    foundationMin: 20,
    description: "Condensing Qi into a visible Golden Core.",
  },
  NGUYEN_ANH: {
    id: "NGUYEN_ANH",
    name: "Nguyên Anh",
    nameLatin: "Nascent Soul",
    subStages: ["SƠ", "TRUNG", "HẬU"],
    pointsPerSubStage: 243_000,
    baseBreakthroughRate: 0.60,
    foundationMin: 25,
    description: "The Gold Core hatches into a Nascent Soul.",
  },
  HOA_THAN: {
    id: "HOA_THAN",
    name: "Hóa Thần",
    nameLatin: "Spirit Transmute",
    subStages: ["SƠ", "TRUNG", "HẬU"],
    pointsPerSubStage: 729_000,
    baseBreakthroughRate: 0.45,
    foundationMin: 30,
    description: "Soul and body merge into spiritual unity.",
  },
  TRU_THAN: {
    id: "TRU_THAN",
    name: "Trú Thần",
    nameLatin: "Spirit Abiding",
    subStages: ["SƠ", "TRUNG", "HẬU"],
    pointsPerSubStage: 2_187_000,
    baseBreakthroughRate: 0.30,
    foundationMin: 35,
    description: "Achieving spiritual permanence and near-immortality.",
  },
  DAI_THUA: {
    id: "DAI_THUA",
    name: "Đại Thừa",
    nameLatin: "Mahayana",
    subStages: ["SƠ", "TRUNG", "HẬU"],
    pointsPerSubStage: 6_561_000,
    baseBreakthroughRate: 0.15,
    foundationMin: 40,
    description: "Expanding spiritual self to encompass the world.",
  },
  NGU_BAT_TON: {
    id: "NGU_BAT_TON",
    name: "Ngũ Bất Tôn",
    nameLatin: "Transcendent",
    subStages: ["SƠ", "TRUNG", "HẬU"],
    pointsPerSubStage: 19_683_000,
    baseBreakthroughRate: 0.05,
    foundationMin: 50,
    description: "The pinnacle of mortal cultivation.",
  },
} as const;

/** Get the realm index for ordering/comparison */
export function getRealmIndex(realm: RealmId): number {
  return REALM_ORDER.indexOf(realm);
}

/** Check if realm A is higher than realm B */
export function isRealmHigher(a: RealmId, b: RealmId): boolean {
  return getRealmIndex(a) > getRealmIndex(b);
}

/** Get the total points needed for a full realm (all 3 sub-stages) */
export function getRealmTotalPoints(realm: RealmId): number {
  return REALMS[realm]!.pointsPerSubStage * 3;
}

/** Get points needed to reach a specific sub-stage */
export function getPointsToSubStage(realm: RealmId, subStage: number): number {
  return REALMS[realm]!.pointsPerSubStage * subStage;
}
