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
  subStages: readonly ["SO", "TRUNG", "HAU"];
  pointsPerSubStage: number;
  baseBreakthroughRate: number;
  foundationMin: number;
  description: string;
}

export const REALMS: Record<RealmId, RealmDefinition> = {
  LUYEN_THE: {
    id: "LUYEN_THE",
    name: "Luyen The",
    nameLatin: "Mortality",
    subStages: ["SO", "TRUNG", "HAU"],
    pointsPerSubStage: 1_000,
    baseBreakthroughRate: 1.0,
    foundationMin: 0,
    description: "The first realm where mortals sense Qi and begin cultivation.",
  },
  KHI_TUC: {
    id: "KHI_TUC",
    name: "Khi Tuc",
    nameLatin: "Breath",
    subStages: ["SO", "TRUNG", "HAU"],
    pointsPerSubStage: 3_000,
    baseBreakthroughRate: 0.95,
    foundationMin: 5,
    description: "Learning to circulate Qi through meridians.",
  },
  LUYEN_HON: {
    id: "LUYEN_HON",
    name: "Luyen Hon",
    nameLatin: "Soul",
    subStages: ["SO", "TRUNG", "HAU"],
    pointsPerSubStage: 9_000,
    baseBreakthroughRate: 0.90,
    foundationMin: 10,
    description: "The soul is refined, granting spiritual perception.",
  },
  TRUC_MACH: {
    id: "TRUC_MACH",
    name: "Truc Mach",
    nameLatin: "Foundation",
    subStages: ["SO", "TRUNG", "HAU"],
    pointsPerSubStage: 27_000,
    baseBreakthroughRate: 0.85,
    foundationMin: 15,
    description: "Establishing a permanent foundation for power.",
  },
  KIM_DAN: {
    id: "KIM_DAN",
    name: "Kim Dan",
    nameLatin: "Gold Core",
    subStages: ["SO", "TRUNG", "HAU"],
    pointsPerSubStage: 81_000,
    baseBreakthroughRate: 0.75,
    foundationMin: 20,
    description: "Condensing Qi into a visible Golden Core.",
  },
  NGUYEN_ANH: {
    id: "NGUYEN_ANH",
    name: "Nguyen Anh",
    nameLatin: "Nascent Soul",
    subStages: ["SO", "TRUNG", "HAU"],
    pointsPerSubStage: 243_000,
    baseBreakthroughRate: 0.60,
    foundationMin: 25,
    description: "The Gold Core hatches into a Nascent Soul.",
  },
  HOA_THAN: {
    id: "HOA_THAN",
    name: "Hoa Than",
    nameLatin: "Spirit Transmute",
    subStages: ["SO", "TRUNG", "HAU"],
    pointsPerSubStage: 729_000,
    baseBreakthroughRate: 0.45,
    foundationMin: 30,
    description: "Soul and body merge into spiritual unity.",
  },
  TRU_THAN: {
    id: "TRU_THAN",
    name: "Tru Than",
    nameLatin: "Spirit Abiding",
    subStages: ["SO", "TRUNG", "HAU"],
    pointsPerSubStage: 2_187_000,
    baseBreakthroughRate: 0.30,
    foundationMin: 35,
    description: "Achieving spiritual permanence and near-immortality.",
  },
  DAI_THUA: {
    id: "DAI_THUA",
    name: "Dai Thua",
    nameLatin: "Mahayana",
    subStages: ["SO", "TRUNG", "HAU"],
    pointsPerSubStage: 6_561_000,
    baseBreakthroughRate: 0.15,
    foundationMin: 40,
    description: "Expanding spiritual self to encompass the world.",
  },
  NGU_BAT_TON: {
    id: "NGU_BAT_TON",
    name: "Ngu Bat Ton",
    nameLatin: "Transcendent",
    subStages: ["SO", "TRUNG", "HAU"],
    pointsPerSubStage: 19_683_000,
    baseBreakthroughRate: 0.05,
    foundationMin: 50,
    description: "The pinnacle of mortal cultivation.",
  },
} as const;

export function getRealmIndex(realm: RealmId): number {
  return REALM_ORDER.indexOf(realm);
}

export function isRealmHigher(a: RealmId, b: RealmId): boolean {
  return getRealmIndex(a) > getRealmIndex(b);
}

export function getRealmTotalPoints(realm: RealmId): number {
  return REALMS[realm]!.pointsPerSubStage * 3;
}

export function getPointsToSubStage(realm: RealmId, subStage: number): number {
  return REALMS[realm]!.pointsPerSubStage * subStage;
}
