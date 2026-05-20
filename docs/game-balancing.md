# Thiên Nam Võ Lục — Game Balancing

> **Thiên Đạo quyết**: Mọi thăng trầm đều có quy luật. Điều chỉnh cẩn thận, kẻo thiên hạ loạn.
>
> — *Chương 5, Điều 12, Quyển Thiên*

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Economy Balance](#2-economy-balance)
3. [Cultivation Speed](#3-cultivation-speed)
4. [Breakthrough Rates](#4-breakthrough-rates)
5. [Alchemy Difficulty](#5-alchemy-difficulty)
6. [Combat Balance](#6-combat-balance)
7. [Sect Power Curve](#7-sect-power-curve)
8. [Leaderboard Tuning](#8-leaderboard-tuning)
9. [Seasonal Adjustments](#9-seasonal-adjustments)
10. [Anti-Exploit Measures](#10-anti-exploit-measures)
11. [Monitoring and Alerts](#11-monitoring-and-alerts)

---

## 1. Design Philosophy

### 1.1 Core Principles

1. **Progression feels earned** — Every advancement should feel meaningful, not trivial.
2. **Risk/reward is always present** — Higher reward actions should have genuine risk.
3. **No pay-to-win** — All purchases are cosmetic or convenience, never power.
4. **Content stays relevant** — Early-game content should remain useful in some way.
5. **Veteran investment matters** — Long-term players should have meaningful advantages.

### 1.2 Target Metrics

| Metric | Target | Why |
|--------|--------|-----|
| New player reaches Luyện Hồn | 3-5 days | Reasonable early goal |
| Mid-game player (Trúc Mạch) | 2-4 weeks | Sustained engagement |
| Late-game player (Nguyên Anh) | 2-3 months | Long-term aspiration |
| Active daily users | 70%+ retention | Healthy server |
| Revenue per user | N/A (free game) | N/A |

---

## 2. Economy Balance

### 2.1 Currency Generation Rates

**Silver per day (active player)**

| Source | Amount | Frequency | Notes |
|--------|--------|-----------|-------|
| Daily reward | 100 Ag | Once/day | Base income |
| Standard cultivation | 50 Ag | Per session | After cultivation |
| Quest (easy) | 50-200 Ag | 1-3/day | Early game |
| Quest (medium) | 200-800 Ag | 1-2/day | Mid game |
| Combat (easy) | 30-100 Ag | Variable | Low risk |
| Combat (hard) | 200-500 Ag | Variable | Higher risk |
| Sect mission | 100-500 Ag | Daily | With sect |

**Expected daily silver income (active player):**

- Early game (Luyện Thể): ~300-500 Ag/day
- Mid game (Trúc Mạch): ~1,000-3,000 Ag/day
- Late game (Nguyên Anh): ~5,000-10,000 Ag/day

### 2.2 Currency Sink Rates

**Mandatory sinks (everyone):**

| Sink | Cost | Frequency | Notes |
|------|------|-----------|-------|
| Travel (intra-region) | 10-50 Ag | 2-3/day | Necessary for content |
| Repair (minor) | 5-20 Ag | Daily | Equipment maintenance |
| Storage | 5 Ag/item | Daily | Inventory management |

**Optional but recommended sinks:**

| Sink | Cost | Frequency | Notes |
|------|------|-----------|-------|
| Travel (inter-region) | 100-500 Ag | Weekly | Access different content |
| Manual inscription | 100-1,000 ST | Rare | Learning new techniques |
| Cauldron repair | 50-500 Ag | Monthly | For alchemy players |
| Item enhancement | 200-2,000 ST | Rare | Power increase |

### 2.3 Economy Health Indicators

| Indicator | Healthy | Warning | Critical |
|-----------|---------|---------|---------|
| Silver per active player per day | 1,000-5,000 | >10,000 | >50,000 |
| Spirit stones circulation | 10-50/week | >100/week | >500/week |
| Price of basic item (Trúc Mạch Đan) | 50-200 ST | 200-500 ST | >500 ST |
| Price of basic item (Thanh Tâm Đan) | 10-30 ST | 30-100 ST | >100 ST |

### 2.4 Economy Formulas

**Inflation adjustment (auto-correct):**

```
if averagePlayerSilver > 10,000:
  questSilverReward *= 0.95
  dailyReward *= 0.95
  repairCosts *= 1.05

if averagePlayerSilver < 500:
  questSilverReward *= 1.10
  dailyReward *= 1.10
  repairCosts *= 0.90
```

**Item value formula:**

```
itemBaseValue = materialCost × 2
finalPrice = itemBaseValue × (1 + scarcityMultiplier) / sellBackRatio
sellBackPrice = finalPrice × 0.5
```

---

## 3. Cultivation Speed

### 3.1 Baseline Cultivation Times

Time to reach each realm from Luyện Thể sơ kỳ, assuming **2 cultivation sessions per day** with standard mode:

| Realm | Total Points Needed | Days (Standard) | Days (Forced) | Days (Seclusion) |
|-------|--------------------|----------------|---------------|-----------------|
| Khí Tức | 9,000 | 9 days | 4 days | 2 days |
| Luyện Hồn | 36,000 | 27 days | 12 days | 6 days |
| Trúc Mạch | 117,000 | 90 days | 40 days | 18 days |
| Kim Đan | 360,000 | 270 days | 120 days | 54 days |
| Nguyên Anh | 1,089,000 | 810 days | 360 days | 162 days |

**Target: Kim Đan in ~3-4 months for active player with normal mode.**

### 3.2 Factors Affecting Cultivation Speed

| Factor | Multiplier Range | Cap |
|--------|-----------------|-----|
| Foundation quality | 0.8x to 1.5x | ±30% |
| Location | 0.85x to 1.30x | Variable |
| Manual | 0.9x to 1.3x | ±20% |
| Heart demon | 0.7x to 1.0x | -30% at 80+ HD |
| Sect bonus | 1.0x to 1.2x | +20% |
| Item/buff | 1.0x to 1.5x | Temporary |
| Season | 0.85x to 1.15x | Seasonal |

**Maximum theoretical speed: ~2x baseline (all bonuses stacked)**
**Minimum practical speed: ~0.4x baseline (all penalties)**

### 3.3 Cultivation Comfort Range

For the **majority** of players (not hardcore, not idle):

```
Optimal: 1.0x to 1.2x multiplier
Acceptable: 0.8x to 1.5x multiplier
Punishing: < 0.6x or > 2.0x multiplier
```

Design content so that average players hit the optimal range.

---

## 4. Breakthrough Rates

### 4.1 Base Breakthrough Rates

From world-bible.md, base rates by realm:

| From Realm | To Realm | Base Rate | With Pill | With Sect Formation |
|------------|----------|-----------|-----------|---------------------|
| Luyện Thể hậu kỳ | Khí Tức sơ kỳ | 95% | 99% | 99% |
| Khí Tức hậu kỳ | Luyện Hồn sơ kỳ | 90% | 98% | 99% |
| Luyện Hồn hậu kỳ | Trúc Mạch sơ kỳ | 85% | 97% | 99% |
| Trúc Mạch hậu kỳ | Kim Đan sơ kỳ | 75% | 95% | 98% |
| Kim Đan hậu kỳ | Nguyên Anh sơ kỳ | 60% | 85% | 95% |
| Nguyên Anh hậu kỳ | Hóa Thần sơ kỳ | 45% | 70% | 88% |
| Hóa Thần hậu kỳ | Trú Thần sơ kỳ | 30% | 55% | 75% |
| Trú Thần hậu kỳ | Đại Thừa sơ kỳ | 15% | 35% | 55% |
| Đại Thừa hậu kỳ | Ngũ Bất Tôn | 5% | 15% | 25% |

### 4.2 Breakthrough Rate Adjustments

**Penalty factors:**

```
heartDemonPenalty = 1 - (heartDemon / 200)   // -50% at 100 HD
injuryPenalty = 1 - (injuryLevel × 0.10)      // -30% at level 3 injury
forcedCultivationPenalty = 0.7                // For forced breakthrough

actualRate = baseRate × heartDemonPenalty × injuryPenalty × [forcedCultivationPenalty]
```

**Bonus factors:**

```
foundationBonus = 1 + (foundationQuality / 500)   // +20% at 100 FQ
sectHQBonus = 1.10                                // +10% at sect HQ
manualMasteryBonus = 1 + (manualMasteryLevel / 100)  // +25% at mastery 25
```

### 4.3 Breakthrough Expected Attempts

| Realm Transition | Expected Attempts (avg player) | Max Attempts (bad luck) |
|-----------------|-------------------------------|------------------------|
| Luyện Thể → Khí Tức | 1.1 | 3 |
| Khí Tức → Luyện Hồn | 1.2 | 4 |
| Luyện Hồn → Trúc Mạch | 1.4 | 5 |
| Trúc Mạch → Kim Đan | 2.0 | 8 |
| Kim Đan → Nguyên Anh | 3.3 | 15 |
| Nguyên Anh → Hóa Thần | 5.5 | 25 |
| Hóa Thần → Trú Thần | 8.3 | 40 |
| Trú Thần → Đại Thừa | 15.4 | 70 |
| Đại Thừa → Ngũ Bất Tôn | 50+ | N/A |

**Design rule: Players should feel "close" to breakthrough after 3-5 attempts.**

---

## 5. Alchemy Difficulty

### 5.1 Pill Creation Success Rates

| Pill Category | Easy (Hạ Phẩm) | Medium (Trung Phẩm) | Hard (Thượng Phẩm) | Expert (Cực Phẩm) |
|--------------|---------------|--------------------|--------------------|-------------------|
| Trị Liệu | 90% | 65% | 35% | 10% |
| Tu Luyện | 80% | 50% | 25% | 5% |
| Công Kích | 75% | 45% | 20% | 3% |
| Đặc Biệt | 60% | 30% | 10% | 1% |

**Pill quality determines:**
- Hạ Phẩm: 50% base effect
- Trung Phẩm: 100% base effect
- Thượng Phẩm: 150% base effect + bonus
- Cực Phẩm: 200% base effect + rare bonus + public log

### 5.2 Ingredient Cost vs Pill Value

| Pill | Ingredient Cost | Market Value | Profit Margin |
|------|---------------|--------------|---------------|
| Thanh Tâm Đan (Trung) | 15 ST | 25-35 ST | +40-60% |
| Trúc Mạch Đan (Trung) | 50 ST | 80-120 ST | +40-60% |
| Kim Đan (Trung) | 200 ST | 300-450 ST | +30-50% |
| Thanh Tâm Đan (Thượng) | 15 ST + skill | 60-100 ST | +300-500% |

**Design rule: Alchemy should be profitable but not exploitable.**
**Cap: One player can reasonably produce 5-10 high-quality pills per week.**

### 5.3 Alchemy Time Investment

| Pill | Time to Craft | Rounds | Total Time |
|------|--------------|--------|------------|
| Thanh Tâm Đan | 1 minute | 5 rounds | 5 min |
| Trúc Mạch Đan | 2 minutes | 5 rounds | 10 min |
| Kim Đan | 3 minutes | 5 rounds | 15 min |
| Đại Thừa Đan | 5 minutes | 5 rounds | 25 min |

---

## 6. Combat Balance

### 6.1 Damage Scaling by Realm

```
Level 1-3 (Luyện Thể):   10-30 damage per hit
Level 4-6 (Khí Tức):     30-80 damage per hit
Level 7-9 (Luyện Hồn):   80-200 damage per hit
Level 10-12 (Trúc Mạch): 200-500 damage per hit
Level 13-15 (Kim Đan):   500-1,500 damage per hit
Level 16-18 (Nguyên Anh): 1,500-5,000 damage per hit
Level 19-21 (Hóa Thần+): 5,000+ damage per hit
```

**Rule: Cross-realm combat should favor the higher realm by ~50% but not be impossible.**

### 6.2 HP Scaling by Realm

```
MaxHP = 100 + (currentRealm × 50) + (foundationQuality × 2)

Luyện Thể:   100-250 HP
Khí Tức:      250-450 HP
Luyện Hồn:   450-800 HP
Trúc Mạch:   800-1,500 HP
Kim Đan:     1,500-3,000 HP
Nguyên Anh:  3,000-6,000 HP
Hóa Thần+:   6,000+ HP
```

**Expected combat duration by realm:**

| Realm Tier | Average Combat Turns | Expected Duration |
|------------|--------------------|-----------------|
| Early (Luyện Thể) | 3-5 turns | 10-20 seconds |
| Mid (Trúc Mạch) | 5-10 turns | 20-40 seconds |
| Late (Kim Đan) | 8-15 turns | 30-60 seconds |
| End (Nguyên Anh+) | 10-20 turns | 40-80 seconds |

### 6.3 Loot Balance

| Combat Difficulty | Silver Drop | Spirit Stone Chance | Item Drop Rate |
|-----------------|-------------|--------------------|--------------------|
| Easy (solo mob) | 10-50 Ag | 5% | 10% |
| Medium | 50-200 Ag | 10% | 20% |
| Hard (elite) | 200-500 Ag | 25% | 40% |
| Boss | 500-2000 Ag | 50% | 70% |
| World Boss | 2000-10000 Ag | 80% | 90% |

---

## 7. Sect Power Curve

### 7.1 Sect Member Contribution

Each active member contributes to sect power:

```
sectPower = sum(memberPower) × sectRankMultiplier × treasuryBonus

memberPower = cultivationPoints / 1000 + meritEarned / 100
sectRankMultiplier = 1.0 (★) to 1.5 (★★★★★)
treasuryBonus = 1.0 + (treasuryST / 10000) × 0.1  // capped at +50%
```

### 7.2 Sect War Balance

| Factor | Attacker Advantage | Defender Advantage |
|--------|-------------------|-------------------|
| Home territory | — | +20% stats |
| Formation master | +15% success | — |
| Treasury advantage | +10% per 2x treasury | — |
| Member count | +5% per extra member (max +30%) | — |
| War declaration cooldown | 7 days between wars | — |

**Design rule: Defending should have meaningful advantage. Attacks should require preparation.**

### 7.3 Sect Salary Sustainability

```
maxSalaryPerWeek = sectTreasury / (activeMembers × 4)
// Ensures treasury lasts at least 4 weeks at max salary

recommendedSalary = sectTreasury / (activeMembers × 8)
// Conservative: 8-week runway
```

---

## 8. Leaderboard Tuning

### 8.1 Weighting Formula

Leaderboard rankings use weighted scoring:

```
TuViScore = cultivationPoints
DanhVongScore = reputation × 10
TaiSanScore = silver + (spiritStones × 100)
LuyenDanScore = (basicPills × 1) + (medium × 3) + (high × 10) + (extreme × 50)
CongHuanScore = totalMeritEarned
SatPhatScore = kills × (killedRealmLevel / 10)
```

### 8.2 Leaderboard Decay

To prevent old players holding top forever:

```
effectiveScore = currentScore × (1 - daysSinceLastAction / 90)
// 30-day inactive = -33% effective score
// 60-day inactive = -67% effective score
// 90-day inactive = removed from active leaderboard
```

### 8.3 Soft Caps

| Metric | Soft Cap | Effect Above Cap |
|--------|----------|-----------------|
| Cultivation points | Realm max × 1.5 | No additional leaderboard score |
| Spirit stones | 10,000 | No additional score |
| Reputation | 10,000 | No additional score |
| Merit | 5,000 | No additional score |

---

## 9. Seasonal Adjustments

### 9.1 Season 1-3: Tuning Period

During the first 3 seasons, all balance values should be **lightly tuned**:

- Harvest season: +15% cultivation speed
- Storm season: +20% combat difficulty, +30% rare loot
- Festival season: -50% all cooldowns
- War season: Sect wars more frequent

### 9.2 Player-Driven Balance

After season 3, the admin panel should allow:
- Community votes on balance changes (non-binding)
- Data-driven recommendations based on actual player metrics
- A/B testing on specific values

### 9.3 Seasonal Content Difficulty

| Season Event | Difficulty Modifier | Duration |
|-------------|--------------------|----------|
| Thiên Đạo Biến Động | +30% all difficulty | 3 days |
| Đại Hội Võ Lâm | -20% breakthrough difficulty | 7 days |
| Tông Môn Chiến | +50% sect mission rewards | 7 days |
| Bắc Mạc Đại Chiến | +100% combat XP | 14 days |
| Kỳ Ngộ Đại Hội | +50% encounter luck | 7 days |

---

## 10. Anti-Exploit Measures

### 10.1 Cultivation Farming

**Exploit**: Spam cultivation to gain infinite points.
**Detection**: Track cultivation sessions per hour. Flag if >4 sessions in 1 hour.
**Countermeasure**: Exponential cooldown after 3rd session. Cap at 6 sessions per day.

### 10.2 Alchemy Duplication

**Exploit**: Reload or duplicate pill ingredients.
**Detection**: Inventory transaction log. Flag if ingredients disappear without pill result.
**Countermeasure**: Atomic transactions. Ingredients removed only when pill is created.

### 10.3 Soft Delete Exploit

**Exploit**: Delete and recreate character to reset stats.
**Detection**: Track character creation date and deletions.
**Countermeasure**: Max 1 character deletion per 30 days. Deletion requires 24-hour confirmation.

### 10.4 Combat Exploit

**Exploit**: Enter combat, gain no damage, farm rewards.
**Detection**: Combat log analysis. Flag if win rate >99% with no damage taken for 10+ fights.
**Countermeasure**: Minimum damage floor of 1 HP per 3 turns. Auto-lose if below floor.

### 10.5 Rate Limiting

| Action | Rate Limit | Window |
|--------|-----------|--------|
| `/cultivate` | 6 | Per day |
| `/alchemy` | 10 | Per day |
| `/encounter` | 5 | Per day |
| `/breakthrough` | 1 | Per 24 hours |
| `/combat` | 20 | Per hour |
| `/sect join/leave` | 1 | Per 7 days |
| `/mission accept` | 3 | Per day |
| Any interaction | 30 | Per minute |
| Button press | 5 | Per second |

---

## 11. Monitoring and Alerts

### 11.1 Dashboard Metrics

Admin panel should track in real-time:

```
- Active users (24h, 7d, 30d)
- Average cultivation per user per day
- Average realm distribution
- Economy health (silver per player, item prices)
- Alchemy output (pills per day, quality distribution)
- Combat activity (fights per hour, win/loss ratio)
- Sect activity (new joins, new sects, treasury values)
- Error rates (failed commands, transaction failures)
```

### 11.2 Alert Thresholds

| Metric | Warning | Critical |
|--------|---------|---------|
| Error rate | >1% | >5% |
| Average silver per player | >50,000 | >200,000 |
| Days to reach Kim Đan (avg) | <14 days | <7 days |
| Pill price (Thanh Tâm Đan) | >100 ST | >500 ST |
| Active user drop | >20% week-over-week | >50% |
| Sect treasury disparity | Top sect 10x average | Top sect 50x average |

### 11.3 Balance Adjustment Workflow

1. **Detect** — Metric crosses warning threshold
2. **Analyze** — Check for exploit vs natural player behavior
3. **Propose** — Admin drafts balance change in draft mode
4. **Preview** — Test on 10% of players for 24 hours
5. **Deploy** — Full server if preview shows improvement
6. **Monitor** — Track metric recovery for 7 days
7. **Log** — Record change in admin audit log with justification

**Rule: Never adjust by more than ±20% in one change. Incremental tuning only.**
