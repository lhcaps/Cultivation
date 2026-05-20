/**
 * Combat rules — auto-resolve combat calculations.
 */
import { COMBAT_CONSTANTS, type InjuryLevel } from "../constants/index.js";
import { REALMS, getRealmIndex } from "../constants/realms.js";
import type { CharacterState, CombatResult } from "../types/index.js";

export interface CombatParticipant {
  character: CharacterState;
  attack: number;
  defense: number;
  speed: number;
  critRate: number;
  element?: string;
}

export interface CombatTarget {
  id: string;
  name: string;
  realm: string;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  critRate: number;
  element?: string;
  drops?: { silver: number; spiritStones: number; items: string[] };
}

/**
 * Calculate max HP for a character.
 */
export function calculateMaxHp(realm: string, foundationQuality: number): number {
  const realmIdx = getRealmIndex(realm as never);
  return (
    COMBAT_CONSTANTS.BASE_HP +
    realmIdx * COMBAT_CONSTANTS.HP_PER_REALM +
    foundationQuality * 2
  );
}

/**
 * Calculate max Qi for a character.
 */
export function calculateMaxQi(realm: string, foundationQuality: number): number {
  const realmIdx = getRealmIndex(realm as never);
  return (
    COMBAT_CONSTANTS.BASE_QI +
    realmIdx * COMBAT_CONSTANTS.QI_PER_REALM +
    foundationQuality
  );
}

/**
 * Calculate attack stat.
 */
export function calculateAttack(realm: string, foundationQuality: number): number {
  const realmIdx = getRealmIndex(realm as never);
  return COMBAT_CONSTANTS.BASE_ATTACK + realmIdx * 5 + Math.floor(foundationQuality / 10);
}

/**
 * Calculate damage between attacker and defender.
 */
export function calculateDamage(
  attacker: CombatParticipant,
  defender: CombatParticipant,
): { damage: number; isCrit: boolean; isDodge: boolean; isBlock: boolean } {
  const realmIdx = getRealmIndex(attacker.character.realm);
  const baseDamage = COMBAT_CONSTANTS.BASE_ATTACK + realmIdx * 10;

  // Base damage formula
  let damage = baseDamage * (1 + attacker.attack / 100);

  // Defense reduction (50% effectiveness)
  const defenseReduction = defender.defense * 0.5;
  damage = Math.max(1, damage - defenseReduction);

  // Variance ±10%
  const variance = 1 + (Math.random() - 0.5) * COMBAT_CONSTANTS.DAMAGE_VARIANCE * 2;
  damage = Math.floor(damage * variance);

  // Dodge check
  const isDodge = Math.random() < COMBAT_CONSTANTS.BASE_DODGE_CHANCE;
  if (isDodge) {
    return { damage: 0, isCrit: false, isDodge: true, isBlock: false };
  }

  // Block check (simplified: no block state tracking in this version)
  const isBlock = Math.random() < 0.1;
  if (isBlock) {
    damage = Math.floor(damage * COMBAT_CONSTANTS.BLOCK_DAMAGE_REDUCTION);
    return { damage, isCrit: false, isDodge: false, isBlock: true };
  }

  // Critical hit
  const isCrit = Math.random() < attacker.critRate;
  if (isCrit) {
    damage = Math.floor(damage * COMBAT_CONSTANTS.CRIT_MULTIPLIER);
  }

  return { damage, isCrit, isDodge: false, isBlock: false };
}

/**
 * Resolve a full combat encounter.
 */
export function resolveCombat(
  attacker: CombatParticipant,
  defenderTarget: CombatTarget,
): CombatResult {
  const maxTurns = 20;
  let attackerHp = attacker.character.currentHp;
  let defenderHp = defenderTarget.maxHp;
  let turns = 0;
  let damageDealt = 0;
  let damageTaken = 0;
  let criticalHits = 0;
  const combatLog: string[] = [];

  // Initiative: speed + random(0, speed/10)
  const attackerInit = attacker.speed + Math.random() * (attacker.speed / 10);
  const defenderInit = defenderTarget.speed + Math.random() * (defenderTarget.speed / 10);
  const attackerFirst = attackerInit > defenderInit;

  combatLog.push(
    `⚔️ **TRẬN CHIẾN** — ${attacker.character.name} vs ${defenderTarget.name}`,
    attackerFirst
      ? `${attacker.character.name} hành động trước!`
      : `${defenderTarget.name} hành động trước!`,
    "",
  );

  while (attackerHp > 0 && defenderHp > 0 && turns < maxTurns) {
    turns++;
    combatLog.push(`**Lượt ${turns}**`);

    // Attacker attacks (if first) or defender attacks
    if ((turns === 1 && attackerFirst) || (turns > 1 && attackerFirst)) {
      const atkResult = calculateDamage(attacker, {
        id: defenderTarget.id,
        name: defenderTarget.name,
        realm: defenderTarget.realm,
        maxHp: defenderTarget.maxHp,
        attack: defenderTarget.attack,
        defense: defenderTarget.defense,
        speed: defenderTarget.speed,
        critRate: defenderTarget.critRate,
      });

      defenderHp = Math.max(0, defenderHp - atkResult.damage);
      damageDealt += atkResult.damage;

      if (atkResult.isCrit) criticalHits++;
      const critStr = atkResult.isCrit ? " 💥" : "";
      const dodgeStr = atkResult.isDodge ? " MISS!" : atkResult.isBlock ? " 🛡️" : "";
      combatLog.push(
        `→ ${attacker.character.name} tấn công: ${atkResult.damage} sát thương${critStr}${dodgeStr}`,
        `   ${defenderTarget.name} HP: ${defenderHp}/${defenderTarget.maxHp}`,
      );

      if (defenderHp <= 0) break;

      // Defender counter-attacks
      const defResult = calculateDamage(
        {
          character: {
            ...attacker.character,
            realm: defenderTarget.realm,
            currentHp: defenderHp,
          } as CharacterState,
          attack: defenderTarget.attack,
          defense: defenderTarget.defense,
          speed: defenderTarget.speed,
          critRate: defenderTarget.critRate,
        },
        {
          id: attacker.character.id,
          name: attacker.character.name,
          realm: attacker.character.realm,
          maxHp: attacker.character.maxHp,
          attack: attacker.attack,
          defense: attacker.defense,
          speed: attacker.speed,
          critRate: attacker.critRate,
        },
      );

      attackerHp = Math.max(0, attackerHp - defResult.damage);
      damageTaken += defResult.damage;

      const critStr2 = defResult.isCrit ? " 💥" : "";
      const dodgeStr2 = defResult.isDodge ? " MISS!" : defResult.isBlock ? " 🛡️" : "";
      combatLog.push(
        `→ ${defenderTarget.name} phản công: ${defResult.damage} sát thương${critStr2}${dodgeStr2}`,
        `   ${attacker.character.name} HP: ${attackerHp}/${attacker.character.currentHp}`,
      );
    } else {
      // Defender attacks first this turn
      const defResult = calculateDamage(
        {
          character: {
            ...attacker.character,
            realm: defenderTarget.realm,
            currentHp: attackerHp,
          } as CharacterState,
          attack: defenderTarget.attack,
          defense: defenderTarget.defense,
          speed: defenderTarget.speed,
          critRate: defenderTarget.critRate,
        },
        {
          id: attacker.character.id,
          name: attacker.character.name,
          realm: attacker.character.realm,
          maxHp: attacker.character.maxHp,
          attack: attacker.attack,
          defense: attacker.defense,
          speed: attacker.speed,
          critRate: attacker.critRate,
        },
      );

      attackerHp = Math.max(0, attackerHp - defResult.damage);
      damageTaken += defResult.damage;

      const critStr = defResult.isCrit ? " 💥" : "";
      const dodgeStr = defResult.isDodge ? " MISS!" : defResult.isBlock ? " 🛡️" : "";
      combatLog.push(
        `→ ${defenderTarget.name} tấn công: ${defResult.damage} sát thương${critStr}${dodgeStr}`,
        `   ${attacker.character.name} HP: ${attackerHp}/${attacker.character.currentHp}`,
      );

      if (attackerHp <= 0) break;

      // Attacker counter-attacks
      const atkResult = calculateDamage(attacker, {
        id: defenderTarget.id,
        name: defenderTarget.name,
        realm: defenderTarget.realm,
        maxHp: defenderTarget.maxHp,
        attack: defenderTarget.attack,
        defense: defenderTarget.defense,
        speed: defenderTarget.speed,
        critRate: defenderTarget.critRate,
      });

      defenderHp = Math.max(0, defenderHp - atkResult.damage);
      damageDealt += atkResult.damage;

      if (atkResult.isCrit) criticalHits++;
      const critStr2 = atkResult.isCrit ? " 💥" : "";
      const dodgeStr2 = atkResult.isDodge ? " MISS!" : atkResult.isBlock ? " 🛡️" : "";
      combatLog.push(
        `→ ${attacker.character.name} phản công: ${atkResult.damage} sát thương${critStr2}${dodgeStr2}`,
        `   ${defenderTarget.name} HP: ${defenderHp}/${defenderTarget.maxHp}`,
      );
    }

    combatLog.push("");
  }

  // Determine winner
  const attackerWon = attackerHp > 0;

  // Calculate loot
  let loot = { silver: 0, spiritStones: 0, items: [] as string[] };
  if (attackerWon && defenderTarget.drops) {
    loot = {
      silver: defenderTarget.drops.silver,
      spiritStones: Math.random() < 0.25 ? defenderTarget.drops.spiritStones : 0,
      items: defenderTarget.drops.items ?? [],
    };
  }

  // Calculate rewards
  const rewards = {
    cultivationPoints: attackerWon ? Math.floor(damageDealt / 2) : 0,
    reputation: attackerWon ? Math.floor(damageDealt / 10) : 0,
    merit: attackerWon ? Math.floor(damageDealt / 20) : 0,
  };

  // Calculate penalties
  let injury: InjuryLevel = 0;
  let cultivationLoss = 0;
  let heartDemonGain = 0;
  let deathCheck = false;

  if (!attackerWon) {
    const injuryChance = attacker.character.injuryLevel * COMBAT_CONSTANTS.INJURY_HP_PENALTY;
    deathCheck = Math.random() < injuryChance;
    injury = deathCheck ? 3 : Math.max(1, attacker.character.injuryLevel);
    cultivationLoss = Math.floor(attacker.character.cultivationPoints * COMBAT_CONSTANTS.DEATH_CULTIVATION_PENALTY);
    heartDemonGain = 10;
  } else if (attackerHp < attacker.character.currentHp * 0.2) {
    // Pyrrhic victory
    injury = 1;
    heartDemonGain = 5;
  }

  combatLog.push("═══════════════════════════════════");
  if (attackerWon) {
    combatLog.push(`🎉 **CHIẾN THẮNG!** (${turns} lượt)`);
    if (loot.silver > 0) {
      combatLog.push(`• Thu được: ${loot.silver} Bạc`);
    }
    if (loot.spiritStones > 0) {
      combatLog.push(`• Thu được: ${loot.spiritStones} Linh Thạch`);
    }
    if (rewards.cultivationPoints > 0) {
      combatLog.push(`• Tu vi: +${rewards.cultivationPoints}`);
    }
  } else {
    combatLog.push(`💀 **THẤT BẠI!** (${turns} lượt)`);
    if (deathCheck) {
      combatLog.push("• Bạn đã chết! Cần hồi sinh.");
    }
  }
  combatLog.push("═══════════════════════════════════");

  return {
    winner: attackerWon ? "attacker" : "defender",
    turns,
    attackerHpRemaining: attackerHp,
    defenderHpRemaining: defenderHp,
    damageDealt,
    damageTaken,
    criticalHits,
    loot,
    rewards,
    penalties: {
      injury,
      cultivationLoss,
      heartDemonGain,
      deathCheck,
    },
    combatLog,
  };
}
