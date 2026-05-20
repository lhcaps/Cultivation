# Thiên Nam Võ Lục — Game Rules

> **Thiên Đạo quyết**: Luật chơi là thiên pháp. Tuân theo sẽ sống, vi phạm sẽ bị thiên lôi tru sớm.
>
> — *Chương 3, Điều 7, Quyển Thiên*

---

## Table of Contents

1. [Character Creation](#1-character-creation)
2. [Cultivation System](#2-cultivation-system)
3. [Breakthrough System](#3-breakthrough-system)
4. [Alchemy System](#4-alchemy-system)
5. [Sect System](#5-sect-system)
6. [Combat System](#6-combat-system)
7. [Encounter System](#7-encounter-system)
8. [Mission System](#8-mission-system)
9. [Economy System](#9-economy-system)
10. [Progression Rules](#10-progression-rules)
11. [Status Effects](#11-status-effects)
12. [Death and Rebirth](#12-death-and-rebirth)
13. [Rankings and Seasons](#14-rankings-and-seasons)

---

## 1. Character Creation

### 1.1 Starting Stats

When a player creates their first character, they receive:

| Stat | Starting Value | Description |
|------|---------------|-------------|
| **Realm** | Luyện Thể sơ kỳ | Starting cultivation stage |
| **Foundation Quality** | 20/100 | Base quality, trainable |
| **HP** | 100 | Health points |
| **Qi** | 50 | Energy for abilities |
| **Heart Demon** | 0/100 | Mental corruption meter |
| **Injury Level** | 0 | Physical damage state |
| **Silver** | 500 | Starting currency |
| **Spirit Stones** | 0 | Premium currency |

### 1.2 Stat Formulas

```
MaxHP = 100 + (realm × 50) + (foundationQuality × 2)
MaxQi = 50 + (realm × 25) + (foundationQuality × 1)
Attack = 10 + (realm × 5) + (manualBonus × 2)
Defense = 5 + (realm × 3) + (armorBonus)
Speed = 10 + (realm × 2) + (bootsBonus)
```

### 1.3 Starting Manual

Every new character receives one of three starter manuals based on their region:

| Manual | Region | Element | Bonus |
|--------|--------|---------|-------|
| **Thanh Vân Quyết** | Đại Việt | Thủy | +5% cultivation speed |
| **Trung Nguyên Chính Quyết** | Trung Nguyên | Hỏa | +5% reputation gain |
| **Tây Vực Hỏa Quyết** | Tây Vực | Hỏa | +5% fire damage |

---

## 2. Cultivation System

### 2.1 Cultivation Modes

There are four cultivation modes available via `/cultivate`:

#### Mode 1: Ổn Định Căn Cơ (Stable Foundation)

- **Cultivation Points**: `baseGain × 0.8`
- **Heart Demon**: `0`
- **Risk**: None
- **Best for**: Players with high heart demon, low foundation quality

```
Gain = baseRealmGain × 0.8 × locationQiMultiplier × manualMultiplier
```

#### Mode 2: Cưỡng Ép Tu Luyện (Forced Cultivation)

- **Cultivation Points**: `baseGain × 1.5`
- **Heart Demon**: `+8`
- **Risk**: 12% chance of internal injury (minor)
- **Best for**: Push progression, at own risk

```
Gain = baseRealmGain × 1.5 × locationQiMultiplier × manualMultiplier
RiskRoll = random(0, 1)
if RiskRoll < 0.12 → internalInjury(1)
```

#### Mode 3: Bế Quan (Seclusion)

- **Duration**: 8 hours (BullMQ delayed job)
- **Cultivation Points**: `baseGain × 3.0`
- **Heart Demon**: `+2`
- **Risk**: None, but locks some actions
- **Locked during seclusion**: Combat, missions, travel, sect PvP

```
TotalGain = baseRealmGain × 3.0 × locationQiMultiplier × manualMultiplier
Apply after seclusion-complete job fires
```

#### Mode 4: Tu Luyện Tông Môn (Sect Cultivation)

- **Requirement**: Must be in a sect
- **Cultivation Points**: `baseGain × 1.2 + sectBonus`
- **Heart Demon**: `0`
- **Benefit**: Counts toward sect activity

```
Gain = baseRealmGain × 1.2 × sectCultivationBonus × locationQiMultiplier
+ sectContributionActivity(1)
```

### 2.2 Cultivation Point Requirements

Each realm requires a cumulative amount of cultivation points to advance sub-stages:

| Realm | Points per Sub-stage | Total for Full Realm |
|-------|---------------------|---------------------|
| Luyện Thể | 1,000 | 3,000 |
| Khí Tức | 3,000 | 9,000 |
| Luyện Hồn | 9,000 | 27,000 |
| Trúc Mạch | 27,000 | 81,000 |
| Kim Đan | 81,000 | 243,000 |
| Nguyên Anh | 243,000 | 729,000 |
| Hóa Thần | 729,000 | 2,187,000 |
| Trú Thần | 2,187,000 | 6,561,000 |
| Đại Thừa | 6,561,000 | 19,683,000 |
| Ngũ Bất Tôn | 19,683,000 | MAX |

### 2.3 Cultivation Cooldowns

| Action | Cooldown |
|--------|----------|
| Standard cultivation | 1 hour between sessions |
| Forced cultivation | 2 hours between sessions |
| Seclusion start | 4 hours before next action |
| Seclusion completion | Immediate on job fire |

### 2.4 Location Qi Multipliers

| Region | Qi Multiplier | Effect |
|--------|--------------|--------|
| Sect HQ | 1.20 | Members train at 120% speed |
| Blessed location | 1.15 | Near rare resources |
| Standard region | 1.00 | Normal speed |
| U Minh | 1.30 (but +2 heart demon/day) | High qi but corrupts |
| Desert/Arctic | 0.85 | Harsh conditions |

---

## 3. Breakthrough System

### 3.1 Breakthrough Conditions

All of the following must be met before attempting a breakthrough:

| Condition | Minimum | Notes |
|-----------|---------|-------|
| Cultivation points | 100% of current realm | Must fully saturate |
| Heart demon | < 80 | Higher = higher failure chance |
| Injury level | < 3 | Severe injury blocks breakthrough |
| Manual | Appropriate element | Must match or compatible |
| Location | Any (bonus in sect HQ) | +10% success at sect HQ |

### 3.2 Breakthrough Options

#### Option 1: Ổn Định Đột Phá (Stable Breakthrough)

- **Base success rate**: Realm base rate (see realms.md)
- **Foundation gain**: `+3` on success
- **Risk on failure**: Minor setback, 1-day cooldown
- **No negative stat changes on failure**

```
successRate = baseRealmRate × foundationMultiplier × locationBonus
```

#### Option 2: Cưỡng Ép Đột Phá (Forced Breakthrough)

- **Base success rate**: `baseRate × 0.7`
- **Foundation gain**: `+5` on success
- **Risk on failure**: Internal injury +2, heart demon +10
- **Cooldown**: 3 days

```
successRate = baseRealmRate × 0.7 × foundationMultiplier
onFailure → internalInjury(2), heartDemon(+10)
```

#### Option 3: Dùng Đan (Pill-Assisted)

- **Required**: Appropriate advancement pill (Trúc Mạch Đan, Kim Đan, etc.)
- **Base success rate**: `baseRate × 1.3`
- **Foundation gain**: `+4` on success
- **Risk**: 5% chance of Pill Poison (side effect)
- **Cooldown**: 1 day

```
consumeItem(pillId)
successRate = baseRealmRate × 1.3 × foundationMultiplier
pillPoisonChance = 0.05
```

#### Option 4: Mượn Trận Tông Môn (Sect Formation)

- **Requirement**: Sect with formation master (rank 3+)
- **Base success rate**: `baseRate × 1.5`
- **Foundation gain**: `+6` on success
- **Cost**: 50 merit donated to sect treasury
- **Cooldown**: 1 day

```
successRate = baseRealmRate × 1.5 × foundationMultiplier
deductMerit(50)
sectTreasury += 50
```

### 3.3 Breakthrough Outcomes

#### Critical Success (roll > 95)
- Full realm advancement
- Foundation quality +6
- Public log in #giang-ho-su-kien
- 10% chance of unlocking hidden potential

#### Normal Success
- Full realm advancement
- Foundation quality +3
- Private notification

#### Minor Failure (roll 10-30)
- Keep current realm
- Lose 10% cultivation points
- 1-day cooldown
- No other penalties

#### Severe Failure (roll < 10)
- Keep current realm
- Internal injury level +1
- Heart demon +15
- Lose 25% cultivation points
- 3-day cooldown
- 5% chance of realm regression

### 3.4 Heart Demon Accumulation

Heart demon naturally decays at **1 point per day**. Maximum heart demon is 100.

| Heart Demon Level | Effect |
|------------------|--------|
| 0-20 | Normal gameplay |
| 21-50 | -5% cultivation efficiency |
| 51-80 | -15% cultivation, +10% encounter danger |
| 81-99 | -30% cultivation, breakthrough blocked |
| 100 | Forced Tâm Ma Kiếp event |

---

## 4. Alchemy System

### 4.1 Alchemy Overview

Alchemy is a mini-game with 5 rounds of fire control. Players use buttons/select menus to control their cauldron, and the outcome is calculated based on their choices.

### 4.2 Alchemy Flow

```
/alchemy
  → Step 1: Select recipe (ephemeral select menu)
  → Step 2: Verify ingredients (ephemeral confirmation)
  → Step 3-7: Fire control rounds (ephemeral buttons)
  → Step 8: Resolve and reveal
  → Result: Add to inventory, public log if Cực Phẩm+
```

### 4.3 Pill Categories

| Category | Examples | Difficulty | Required Ingredients |
|----------|----------|-----------|---------------------|
| **Trị Liệu** (Healing) | Thanh Tâm Đan, Hồi Hương Đan | Easy | Common herbs |
| **Tu Luyện** (Cultivation) | Trúc Mạch Đan, Kim Đan | Medium | Rare herbs + spirit stones |
| **Công Kích** (Combat) | Huyết Tinh Đan, Sát Lục Đan | Hard | Monster parts + herbs |
| **Đặc Biệt** (Special) | Đại Thừa Đan, Ngũ Bất Tôn Đan | Expert | Legendary ingredients |

### 4.4 Fire Control Rounds

Each round presents 3 choices that affect the **Stability Meter** (0-100):

#### Round 1: Khởi Lô (Ignite Cauldron)

| Choice | Stability Change | Risk |
|--------|-----------------|------|
| Tiểu Hỏa (Low flame) | +10 stability | Low output |
| Trung Hỏa (Medium) | +5 stability, -3 time | Balanced |
| Đại Hỏa (High flame) | +0 stability, +10 output potential | High risk |

#### Round 2: Dung Dược (Dissolve Ingredients)

| Choice | Stability Change | Effect |
|--------|-----------------|--------|
| Giữ nhiệt (Hold heat) | +5 stability | Steady dissolution |
| Tăng nhiệt (Increase) | +0 stability, +5 output | Medium risk |
| Hạ nhiệt (Decrease) | +10 stability, -5 output | Conservative |

#### Round 3: Lọc Tạp Chất (Filter Impurities)

| Choice | Stability Change | Effect |
|--------|-----------------|--------|
| Ổn định (Stable) | +5 stability | Safe filter |
| Mạnh tay (Aggressive) | -5 stability, +10 purity | Risk reward |
| Dùng thần thức (Use spirit sense) | +0 stability, +5 wisdom bonus | Uses Qi |

#### Round 4: Kết Đan (Form the Pill)

| Choice | Stability Change | Effect |
|--------|-----------------|--------|
| Nhanh (Fast) | -10 stability, +15 output | Quick finish |
| Chậm (Slow) | +5 stability, -5 output | Careful finish |
| Cực chậm (Very slow) | +10 stability, -10 output, +5 quality | Perfectionist |

#### Round 5: Khai Lô (Open Cauldron)

| Choice | Stability Change | Effect |
|--------|-----------------|--------|
| Cưỡng khai (Force open) | -15 stability | High output, high risk |
| Ổn khai (Stable open) | +0 stability | Normal outcome |
| Chờ thêm (Wait more) | +10 stability, -10 output | Safety first |

### 4.5 Pill Quality Calculation

```
baseStability = 50
for each round: baseStability += choiceStabilityModifier
randomVariance = random(-10, +10)
finalStability = clamp(baseStability + randomVariance, 0, 100)

if finalStability >= 90: quality = "Cực Phẩm"  (roll 5% for Ấn Kiếp)
if finalStability >= 75: quality = "Thượng Phẩm"
if finalStability >= 50: quality = "Trung Phẩm"
if finalStability >= 25: quality = "Hạ Phẩm"
if finalStability < 25:  quality = "Thất Bại"
```

### 4.6 Đan Kiếp (Pill Tribulation)

When a player creates a Cực Phẩm pill, there is a **5% chance** of triggering Đan Kiếp:

- All ingredients are consumed
- Player must face a tribulation mini-boss
- Win: Gain the pill + bonus rewards + public log
- Lose: Lose all ingredients + internal injury + heart demon +10

---

## 5. Sect System

### 5.1 Joining a Sect

Players can join one sect at a time. To join:

1. Use `/sect join <sect_name>`
2. If sect is open: immediate join
3. If sect requires application: 24-hour approval period
4. If sect is invite-only: must receive invite from sect leader

### 5.2 Sect Ranks

| Rank | Title | Responsibilities | Benefits |
|------|-------|-----------------|----------|
| 1 | **Tông Chủ** | Leader, accepts members, manages treasury | All sect buffs, shop access |
| 2 | **Trưởng Lão** | Senior advisor, approves applications | Senior buffs, partial shop |
| 3 | **Đại Sư** | Trainer, guides junior members | Training bonus, mentor role |
| 4 | **Nội Đường Đệ Tử** | Core member, sect missions | Core buffs, missions |
| 5 | **Ngoại Đường Đệ Tử** | Regular member | Basic buffs |
| 6 | **Thử Đồ** | Probationary (max 7 days) | Limited buffs |

### 5.3 Sect Contribution

Members earn merit through:

| Activity | Merit Gained |
|----------|-------------|
| Daily cultivation | +1 |
| Completing sect mission | +10-50 |
| Donating spirit stones | 1 merit per 10 stones |
| Defending sect in combat | +20 |
| Killing enemy faction members | +15 |
| Winning sect vs sect battle | +30 |
| Leader donating to member | -50 merit (leader only) |

### 5.4 Sect Benefits

Active members receive:

| Benefit | Effect |
|---------|--------|
| **Cultivation aura** | +10% cultivation speed within sect territory |
| **Alchemy bonus** | +10% pill quality in sect HQ |
| **Defense formation** | Reduces damage by 10% in sect territory |
| **Sect transport** | Free travel to sect-owned locations |
| **Treasury access** | Leaders can distribute resources |

### 5.5 Sect Salary

Every week (Sunday), sect leaders can distribute salary from treasury:

- Minimum treasury requirement: 1000 spirit stones
- Max distribution: treasury balance divided among active members
- Members must have been in sect for 7+ days to receive salary

### 5.6 Sect Wars

Every 30 days, sects can declare war on another sect:

1. War declaration requires 500 merit from treasury
2. War lasts 3 days
3. Victory conditions: destroy enemy treasury OR capture HQ
4. Winner gains: 30% of loser treasury + reputation + merit
5. Loser penalty: disband if treasury < 100, lose 1 rank

---

## 6. Combat System

### 6.1 Combat Overview

Combat in Thiên Nam Engine is primarily **auto-resolve** with stat-based calculations. Turn-based tactical combat is planned for Phase 13.

### 6.2 Combat Flow

```
Initiate combat
  → Calculate initiative (Speed + random(0, speed/10))
  → Loop until one side HP <= 0:
      → Attacker deals damage
      → Defender applies defense
      → Check for crit / dodge / block
      → Apply damage to defender HP
  → Victory: Loot calculation
  → Defeat: Character death check
```

### 6.3 Damage Formula

```
rawDamage = attackerAttack × (1 + skillBonus) × elementMultiplier
defenseReduction = defenderDefense × 0.5
finalDamage = max(1, rawDamage - defenseReduction)

if random() < attackerCritRate:
  finalDamage *= critMultiplier

if defender has block:
  finalDamage *= 0.5
  defenderBlockCooldown = 3 turns

if random() < defenderDodgeChance:
  finalDamage = 0
```

### 6.4 Combat Outcomes

| Outcome | HP Result | Rewards | Penalties |
|---------|----------|---------|----------|
| **Overwhelming Victory** | Attacker > 80% HP | Full loot, +reputation | None |
| **Narrow Victory** | Attacker 20-80% HP | Partial loot | Minor injury risk |
| **Pyrrhic Victory** | Attacker < 20% HP | Small loot | Moderate injury, heart demon +5 |
| **Defeat** | Attacker HP = 0 | No loot | Severe injury + death check |

### 6.5 Death Check

When HP reaches 0, a death check occurs:

```
deathChance = injuryLevel × 0.15
if random() < deathChance:
  → Character enters death state
  → 24-hour revival timer
  → Revival cost: 50 spirit stones or 7-day wait
  → Lose 10% of current cultivation points
  → Heart demon +20
else:
  → Severe injury level +2
  → HP set to 10% of max
  → Heart demon +10
```

---

## 7. Encounter System

### 7.1 Encounter Triggers

Encounters are triggered by `/encounter` command, weighted by:

| Factor | Weight Modifier |
|--------|----------------|
| Region rarity tier | 1-3x based on region |
| Player luck stat | +0% to +10% |
| Current heart demon | +1% per 10 heart demon |
| Active world events | +20% if relevant event |
| Sect affiliation | +15% if sect is related to encounter |
| Time of day | Some encounters only at night |

### 7.2 Encounter Types

| Type | Description | Risk Level | Reward Tier |
|------|-------------|-----------|-----------|
| **Dược Nông** | Meet injured herb gatherer | None | Silver, herbs |
| **Yêu Thú** | Wild beast attack | Low | Beast parts, silver |
| **Tà Giáo** | Encounter evil cultists | Medium | Cultist loot, reputation |
| **Kỳ Ngộ** | Serendipitous discovery | None | Rare manual, item |
| **Truy Nã** | Bounty hunters mistake you | Medium | Bounty if proven innocent |
| **Thiên Tài** | Meet a genius NPC | None | Enlightenment bonus |
| **Cổ Địa** | Ancient ruins discovery | High | Artifacts, ancient manuals |
| **Quỷ Vật** | Ghost/spirit encounter | Medium | Soul fragments, spirit stones |

### 7.3 Encounter Data Structure

All encounters are data-driven in the database:

```json
{
  "id": "linh_khe_poison_trace",
  "region": "dai_viet",
  "requiredRealmMin": "noi_tuc",
  "requiredRealmMax": "kim_dan",
  "weight": 20,
  "choices": [
    {
      "label": "Điều tra dấu độc",
      "effects": {
        "reputation": 10,
        "spiritStones": 5,
        "riskInjuryChance": 0.08,
        "factionImpact": { "van_doc": -10 }
      }
    },
    {
      "label": "Bỏ qua và rời đi",
      "effects": {
        "luckBonus": 5,
        "reputation": -5
      }
    }
  ]
}
```

---

## 8. Mission System

### 8.1 Mission Types

| Type | Duration | Risk | Reward |
|------|----------|------|--------|
| **Hộ Tống** (Escort) | 1-3 hours | Medium | Silver + spirit stones + reputation |
| **Diệt Yêu Thú** (Beast Hunt) | 2-4 hours | Medium-High | Beast parts + silver + sect merit |
| **Thu Thập Dược Liệu** (Herb Gathering) | 1-2 hours | Low | Herbs + silver |
| **Điều Tra Tà Giáo** (Investigate Cult) | 3-6 hours | High | Intelligence + reputation + rare item |
| **Truy Nã** (Manhunt) | 4-8 hours | High | Bounty + silver + honor |
| **Tông Môn Nhiệm Vụ** (Sect Mission) | Daily/Weekly | Varies | Sect merit + treasury contribution |
| **Ẩn Tuyến Kỳ Ngộ** (Hidden Encounter) | Instant | None | Variable |

### 8.2 Mission Requirements

| Requirement | Description |
|-------------|-------------|
| Realm minimum | Player must be at or above minimum realm |
| Item requirement | Some missions require specific items |
| Reputation minimum | Minimum reputation needed |
| Sect membership | Some missions require sect affiliation |
| Faction alignment | Certain missions only for specific factions |

### 8.3 Mission Failure

| Failure Type | Cause | Penalty |
|-------------|-------|--------|
| **Timeout** | Mission timer expires | -50% reward, no penalty |
| **Death during mission** | HP reaches 0 | Mission failed, severe injury |
| **Retreat** | Player voluntarily abandons | -reputation, -heart demon, 24h cooldown |
| **Betrayal** | Player betrays mission giver | -major reputation, hostile to NPC faction |

---

## 9. Economy System

### 9.1 Currency Values

| Currency | Abbr | Base Value | Acquisition | Primary Use |
|----------|------|-----------|-------------|-------------|
| **Bạc** | Ag | 1 | Daily, quests, combat | Basic purchases, repairs, travel |
| **Linh Thạch** | ST | 100 Ag | Breakthrough, alchemy, rare drops | Advancement, manuals, pills |
| **Công Huân** | Mer | — | Sect activities | Sect shop, rank benefits |
| **Danh Vọng** | Rep | — | Quests, public deeds | Reputation-only items |
| **Thiên Đạo Ấn** | HS | — | World events, season | Event items, titles |

### 9.2 Economy Sinks

Every economy needs sinks to prevent inflation. The following sinks exist:

| Sink | Currency | Cost | Purpose |
|------|---------|------|---------|
| Repair cauldron | Silver | 20% of cauldron value | Maintain alchemy equipment |
| Travel | Silver | 10-500 based on distance | Inter-region travel |
| Item storage | Silver | 5 per item per day | Overflow inventory |
| Revival | Spirit Stones | 50 ST | Death revival |
| Manual inscription | Spirit Stones | 100-1000 ST | Learn new manuals |
| Sect upgrade | Spirit Stones | 1000+ ST | Upgrade sect rank |
| Auction listing | Silver | 5% of item value | Sell to other players |
| Name change | Spirit Stones | 500 ST | Rename character |

### 9.3 Item Categories

| Category | Description | Durability | Tradeable |
|----------|-------------|-----------|----------|
| **Trang bị** (Equipment) | Weapons, armor, accessories | Yes | Yes |
| **Đan dược** (Pills) | Consumable items | No | Yes |
| **Nguyên liệu** (Ingredients) | Crafting materials | No | Yes |
| **Công pháp** (Manuals) | Learnable techniques | No | No (bind on learn) |
| **Nhiệm vụ** (Quest items) | Quest-specific items | No | No |
| **Tài liệu** (Documents) | Lore items | No | Yes |

---

## 10. Progression Rules

### 10.1 Time-Gated Progression

| Action | Gate | Duration |
|--------|------|----------|
| Breakthrough | Cooldown after attempt | 1-3 days |
| Sect rank up | Time in current rank | 7 days minimum |
| Realm unlock | Complete previous realm | No gate |
| Item unlock | Reach required realm | Automatic |
| Area unlock | Reach required realm + quest | Quest required |

### 10.2 Power Curve

The game follows a deliberate power curve to keep content relevant:

```
Early game (Luyện Thể - Luyện Hồn):
  - Focus on cultivation and learning
  - Basic encounters and missions
  - Small silver gains

Mid game (Trúc Mạch - Nguyên Anh):
  - Alchemy becomes important
  - Sect involvement critical
  - Regional events unlock

Late game (Hóa Thần - Đại Thừa):
  - Competitive leaderboards
  - Sect wars and world events
  - Seasonal content

End game (Ngũ Bất Tôn):
  - Prestige/leaderboard focus
  - Mentor role for new players
  - Seasonal titles and rewards
```

---

## 11. Status Effects

### 11.1 Status Effect List

| Effect | Duration | Cause | Treatment |
|--------|----------|-------|-----------|
| **Nội Thương** (Internal Injury) | 3 days × level | Forced cultivation, combat loss | Rest + healing pill |
| **Tâm Ma** (Heart Demon) | Until cleared | Forced cultivation, U Minh, death | Purification, time |
| **Trúng Độc** (Poison) | 1-7 days | Toxic region, failed alchemy | Antidote pill |
| **Suy Nhược** (Exhaustion) | 6 hours | Over-cultivation, failed seclusion | Rest |
| **Hồn Phách Bất Toàn** (Soul Fragmented) | 7 days | U Minh exposure, severe injury | Soul-calling ritual |
| **Chiến Tranh** (War debuff) | Until war ends | Sect war | Win war |
| **Thiên Lôi** (Thunder Tribulation) | Until survived | Breakthrough Kim Đan+ | Survive tribulation |

### 11.2 Status Interaction Rules

- Multiple injuries stack: `finalHP = maxHP × (1 - injuryLevel × 0.10)`
- Heart demon + injury = critical cultivation penalty: `-30% efficiency`
- Poison reduces healing effectiveness by 50%
- Soul fragmented blocks breakthrough entirely

---

## 12. Death and Rebirth

### 12.1 Death State

When a character dies:

1. Enter **Hồn Đoạt** (Soul Fragmented) state for 24 hours
2. Character is immobile and cannot perform actions
3. Revival options appear:

| Option | Cost | Time | Effect |
|--------|------|------|--------|
| **Thiên Đạo Phục Sinh** (Admin revive) | 50 Spirit Stones | Instant | Full restore |
| **Tự Nhiên Hồi Sinh** (Natural) | Free | 7 days | Full restore, -20% cultivation |
| **Hồn Phách Truyền Thụ** (Soul transfer) | 100 Spirit Stones | Instant | Full restore, +10% comprehension |

### 12.2 Rebirth (Tu Chân Nhập Thổ)

For characters who reach a full realm at Ngũ Bất Tôn, a special option unlocks:

- **Tu Chân Nhập Thổ**: Start fresh with 10% of all stats transferred to new character
- Permanently earned: Titles, achievements, season ranks
- This is **one-time only** and requires admin approval

---

## 14. Rankings and Seasons

### 14.1 Leaderboard Categories

| Category | Measurement | Reset |
|----------|-------------|-------|
| **Tu Vi Đại Hà** | Cultivation points total | Season |
| **Danh Vọng** | Reputation points | Season |
| **Tài Sản** | Total net worth (items + currency) | Season |
| **Luyện Đan Sư** | Pills created (quality-weighted) | Season |
| **Công Huân** | Total merit earned | Season |
| **Sát Phạt** | PvP kills | Season |
| **Tông Môn** | Combined sect member stats | Season |
| **Kỳ Ngộ** | Rare encounters completed | Season |

### 14.2 Season System

| Season Duration | 30 days |
|----------------|---------|
| Season Start | Automatic on server |
| Season End | Top 10 per category receive titles |
| Season Titles | See 14.3 |
| Stat Reset | None (only leaderboard resets) |
| Item Reset | None |

### 14.3 Season Titles

| Rank | Title | Reward |
|------|-------|--------|
| 1st | **Thiên Tài** | 100 HS + exclusive title + item |
| 2nd | **Nhân Tài** | 75 HS + exclusive title |
| 3rd | **Xuất Chúng** | 50 HS + exclusive title |
| Top 10 | **Lưỡng Tài** | 25 HS |
| Top 50 | **Tu Sĩ Trung Bình** | 10 HS |
| Participant | **Mùa Chín Tháng** | 1 HS |

---

## Appendix: Command Reference

| Command | Category | Ephemeral | Public Log |
|---------|----------|-----------|-----------|
| `/start` | Core | No | No |
| `/profile` | Core | Yes | No |
| `/cultivate` | Cultivation | Yes | Only Cực Phẩm gain |
| `/breakthrough` | Cultivation | Yes | On success Nguyên Anh+ |
| `/alchemy` | Crafting | Yes | Only Cực Phẩm or Đan Kiếp |
| `/encounter` | Exploration | Yes | Only on rare encounter |
| `/mission` | Quest | Yes | Only on mission completion |
| `/sect` | Social | Yes | On join/leave/promote |
| `/travel` | Travel | Yes | On region change |
| `/combat` | Combat | No | Combat result |
| `/leaderboard` | Info | Yes | No |
| `/logs` | Info | Yes | No |
