/**
 * Sect rules tests — membership, benefits, and contribution.
 */
import { describe, it, expect } from "vitest";
import {
  canJoinSect,
  getSectMemberCap,
  calculateSectBenefits,
  calculateMeritContribution,
  getSectAlignmentColor,
} from "./sect.js";
import type { CharacterState, SectState } from "../types/index.js";

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

function makeSect(overrides: Partial<SectState> = {}): SectState {
  return {
    id: "test-sect",
    name: "Test Sect",
    alignment: "TRUNG",
    rank: 5,
    treasury: 0,
    memberCount: 0,
    headquartersRegion: "DAI_VIET",
    benefits: [],
    isInviteOnly: false,
    warDeclarations: [],
    ...overrides,
  };
}

describe("canJoinSect", () => {
  it("rejects if character already in a sect", () => {
    const char = makeCharacter({ sectId: "other-sect" });
    const sect = makeSect();
    const result = canJoinSect(char, sect);
    expect(result.valid).toBe(false);
    expect(result.reason).toContain("đã gia nhập");
  });

  it("rejects invite-only sect", () => {
    const char = makeCharacter({ sectId: null });
    const sect = makeSect({ isInviteOnly: true });
    const result = canJoinSect(char, sect);
    expect(result.valid).toBe(false);
    expect(result.reason).toContain("lời mời");
  });

  it("rejects full sect", () => {
    const char = makeCharacter({ sectId: null });
    const sect = makeSect({ memberCount: 10 }); // rank 5 cap = 10
    const result = canJoinSect(char, sect);
    expect(result.valid).toBe(false);
    expect(result.reason).toContain("đầy");
  });

  it("passes when all conditions met", () => {
    const char = makeCharacter({ sectId: null });
    const sect = makeSect({ isInviteOnly: false, memberCount: 5 });
    const result = canJoinSect(char, sect);
    expect(result.valid).toBe(true);
    expect(result.reason).toBeNull();
  });
});

describe("getSectMemberCap", () => {
  it("returns correct caps for each rank", () => {
    expect(getSectMemberCap(1)).toBe(10);
    expect(getSectMemberCap(2)).toBe(50);
    expect(getSectMemberCap(3)).toBe(30);
    expect(getSectMemberCap(4)).toBe(20);
    expect(getSectMemberCap(5)).toBe(10);
  });
});

describe("calculateSectBenefits", () => {
  it("returns higher benefits for higher rank sects", () => {
    const lowRank = makeSect({ rank: 1 });
    const highRank = makeSect({ rank: 5 });
    const low = calculateSectBenefits(makeCharacter(), lowRank);
    const high = calculateSectBenefits(makeCharacter(), highRank);
    expect(high.cultivationBonus).toBeGreaterThan(low.cultivationBonus);
  });
});

describe("calculateMeritContribution", () => {
  it("returns correct values for each action type", () => {
    expect(calculateMeritContribution("daily")).toBe(1);
    expect(calculateMeritContribution("mission_easy")).toBe(5);
    expect(calculateMeritContribution("mission_hard")).toBe(20);
    expect(calculateMeritContribution("defend")).toBe(20);
    expect(calculateMeritContribution("kill_enemy")).toBe(15);
    expect(calculateMeritContribution("war_victory")).toBe(30);
  });

  it("returns 0 for unknown action", () => {
    expect(calculateMeritContribution("unknown" as never)).toBe(0);
  });
});

describe("getSectAlignmentColor", () => {
  it("returns numeric color for each alignment", () => {
    expect(getSectAlignmentColor("CHINH")).toBe(0x00ff00);
    expect(getSectAlignmentColor("TA")).toBe(0x9900ff);
    expect(getSectAlignmentColor("TRUNG")).toBe(0x888888);
  });
});
