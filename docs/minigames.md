# Thiên Nam Võ Lục — Minigames Specification

> **Thiên Đạo quyết**: Mỗi hành động tu luyện đều là một trận chiến với chính mình. Người tu tiên phải hiểu rõ luật để chiến thắng.
>
> — *Chương 7, Điều 1, Quyển Thủ*

---

## 1. Cultivation Mini-Game

### 1.1 Flow Diagram

```
/cultivate
    │
    ▼
[Show ephemeral cultivation menu]
    │
    ├─ [Ổn Định Căn Cơ] ──────► Process + Apply results
    ├─ [Cưỡng Ép Tu Luyện] ──► Process + Risk roll
    ├─ [Bế Quan 8 Giờ] ───────► Schedule BullMQ job
    └─ [Tu Luyện Tông Môn] ───► Process + Sect activity log
```

### 1.2 UI States

**State 1: Selection Menu**

```
╔══════════════════════════════════════╗
║     🧘 TU LUYỆN — Linh Khê Cốc      ║
║  Tu vi: 2,450 / 3,000 (Khí Tức Sơ)  ║
╠══════════════════════════════════════╣
║  [1️⃣ Ổn Định Căn Cơ]       +80 CP   ║
║      Tâm ma: +0 | Rủi ro: 0%        ║
║                                      ║
║  [2️⃣ Cưỡng Ép Tu Luyện]    +150 CP  ║
║      Tâm ma: +8 | Rủi ro: 12%       ║
║                                      ║
║  [3️⃣ Bế Quan 8 Giờ]        +240 CP  ║
║      Tâm ma: +2 | Khóa hành động   ║
║                                      ║
║  [4️⃣ Tu Luyện Tông Môn]    +120 CP  ║
║      Tâm ma: +0 | +1 công huân      ║
║      (Thanh Vân Tông)                ║
╠══════════════════════════════════════╣
║  Cooldown: 45 phút còn lại          ║
╚══════════════════════════════════════╝
```

**State 2: Result (ephemeral, private)**

```
╔══════════════════════════════════════╗
║     ✨ KẾT QUẢ TU LUYỆN              ║
╠══════════════════════════════════════╣
║  Chế độ: Cưỡng Ép Tu Luyện          ║
║                                      ║
║  Tu vi: +150                         ║
║  Tâm ma: +8                          ║
║  Tổng tu vi: 2,600 / 3,000          ║
║  ████████████░░░░░░░  87%           ║
║                                      ║
║  ════════════════════════════        ║
║  ⚠️ Nguy hiểm phát hiện!            ║
║  Bạn đã nội thương nhẹ!             ║
║  HP: -10 (trong 3 ngày)             ║
║  ════════════════════════════        ║
║                                      ║
║  Tiến độ: Có thể thử đột phá!       ║
║  [🔄 Tu Luyện Lại]  [📊 Xem Stats]  ║
╚══════════════════════════════════════╝
```

### 1.3 Calculation Data

```typescript
const cultivationModes = {
  stable: {
    multiplier: 0.8,
    heartDemon: 0,
    riskChance: 0,
    riskEffect: null,
    cooldownHours: 1,
  },
  forced: {
    multiplier: 1.5,
    heartDemon: 8,
    riskChance: 0.12,
    riskEffect: { type: 'injury', level: 1 },
    cooldownHours: 2,
  },
  seclusion: {
    multiplier: 3.0,
    heartDemon: 2,
    riskChance: 0,
    riskEffect: null,
    durationHours: 8,
    lockedActions: ['combat', 'mission', 'travel', 'alchemy'],
    cooldownHours: 4, // before next seclusion
  },
  sect: {
    multiplier: 1.2,
    heartDemon: 0,
    riskChance: 0,
    riskEffect: null,
    sectBonus: { type: 'merit', amount: 1 },
    cooldownHours: 1,
  }
};
```

---

## 2. Alchemy Mini-Game

### 2.1 Flow Diagram

```
/alchemy
    │
    ▼
[Select Recipe — ephemeral select menu]
    │
    ├─ Thanh Tâm Đan (Dễ)
    ├─ Trúc Mạch Đan (Trung bình)
    ├─ Kim Đan (Khó)
    └─ Đại Thừa Đan (Chuyên gia)
    │
    ▼
[Verify Ingredients — ephemeral buttons]
    │
    ├─ [Xác nhận luyện]
    └─ [Hủy bỏ]
    │
    ▼
[Fire Control — 5 rounds, ephemeral buttons]
    │
    ├─ Round 1: Khởi Lô ─► [Tiểu Hỏa] [Trung Hỏa] [Đại Hỏa]
    ├─ Round 2: Dung Dược ─► [Giữ nhiệt] [Tăng nhiệt] [Hạ nhiệt]
    ├─ Round 3: Lọc Tạp Chất ─► [Ổn định] [Mạnh tay] [Dùng thần thức]
    ├─ Round 4: Kết Đan ─► [Nhanh] [Chậm] [Cực chậm]
    └─ Round 5: Khai Lô ─► [Cưỡng khai] [Ổn khai] [Chờ thêm]
    │
    ▼
[Calculate & Reveal — ephemeral + public if notable]
```

### 2.2 UI States

**State 1: Recipe Selection**

```
╔══════════════════════════════════════╗
║     🧪 LUYỆN ĐAN — Chọn Đan Phương  ║
╠══════════════════════════════════════╣
║                                      ║
║  [1️⃣ Thanh Tâm Đan]    Dễ            ║
║      Cần: 3x Dược thảo              ║
║      Thời gian: 5 phút              ║
║                                      ║
║  [2️⃣ Trúc Mạch Đan]   Trung bình     ║
║      Cần: 5x Dược thảo + 2x Linh thảo ║
║      Thời gian: 10 phút             ║
║                                      ║
║  [3️⃣ Kim Đan]          Khó            ║
║      Cần: 10x Nguyên liệu + 5x ST    ║
║      Thời gian: 15 phút             ║
║                                      ║
║  [4️⃣ Đại Thừa Đan]    Chuyên gia     ║
║      Cần: 20x Nguyên liệu + 20x ST   ║
║      Thời gian: 25 phút             ║
║                                      ║
╠══════════════════════════════════════╣
║  Nguyên liệu trong túi: 15          ║
║  Lò kim loại: Sẵn sàng              ║
╚══════════════════════════════════════╝
```

**State 2: Fire Control Rounds**

```
╔══════════════════════════════════════╗
║     🔥 LUYỆN ĐAN — Lượt 3/5          ║
║     Trúc Mạch Đan · Độ ổn định: 65  ║
╠══════════════════════════════════════╣
║                                      ║
║  Lượt 1: Khởi Lô          ✓ +5      ║
║  Lượt 2: Dung Dược         ✓ +0      ║
║  ► Lượt 3: Lọc Tạp Chất             ║
║                                      ║
║  ════════════════════════════════    ║
║  Chọn phương pháp lọc:               ║
║                                      ║
║  [1️⃣ Ổn Định]                       ║
║     Độ ổn định: +5                   ║
║     Rủi ro: Thấp                     ║
║                                      ║
║  [2️⃣ Mạnh Tay]                      ║
║     Độ ổn định: -5                   ║
║     Rủi ro: Trung bình               ║
║     Độ tinh khiết: +10               ║
║                                      ║
║  [3️⃣ Dùng Thần Thức]                ║
║     Độ ổn định: +0                   ║
║     Rủi ro: Thấp                     ║
║     Tiêu hao Qi: -10                 ║
║                                      ║
║  [⏱️ 30 giây còn lại]               ║
╚══════════════════════════════════════╝
```

**State 3: Result**

```
╔══════════════════════════════════════╗
║     ✨ KẾT QUẢ LUYỆN ĐAN             ║
╠══════════════════════════════════════╣
║                                      ║
║         🌟🌟🌟🌟🌟                    ║
║       THƯỢNG PHẨM ĐAN!               ║
║                                      ║
║  Độ ổn định: 85/100                  ║
║  Độ tinh khiết: 72/100               ║
║  Thời gian: 10 phút                  ║
║                                      ║
║  ════════════════════════════════    ║
║  Thu được:                           ║
║  • Trúc Mạch Đan (Thượng Phẩm) x1   ║
║    → +15% breakthrough bonus          ║
║    → Sell value: 350 ST              ║
║  ════════════════════════════════    ║
║                                      ║
║  [📦 Vào túi đồ]   [💰 Bán ngay]    ║
╚══════════════════════════════════════╝
```

### 2.3 Quality Calculation

```typescript
function calculatePillQuality(
  choices: FireControlChoice[],
  baseIngredients: number,
  alchemistSkill: number,
  regionBonus: number
): PillResult {
  let stability = 50;
  let purity = 30;
  let output = 40;

  for (const choice of choices) {
    stability += choice.stabilityMod;
    purity += choice.purityMod;
    output += choice.outputMod;
  }

  // Apply modifiers
  stability += alchemistSkill * 0.5;    // Skill bonus
  stability += regionBonus;              // Region bonus
  stability += random(-10, 10);          // Random variance

  // Clamp values
  stability = clamp(stability, 0, 100);
  purity = clamp(purity, 0, 100);
  output = clamp(output, 0, 100);

  // Determine quality
  if (stability >= 90 && purity >= 80) {
    return { quality: 'Cực Phẩm', tribulationChance: 0.05 };
  }
  if (stability >= 75 && purity >= 60) {
    return { quality: 'Thượng Phẩm' };
  }
  if (stability >= 50 && purity >= 40) {
    return { quality: 'Trung Phẩm' };
  }
  if (stability >= 25) {
    return { quality: 'Hạ Phẩm' };
  }
  return { quality: 'Thất Bại', ingredientsLost: true };
}
```

---

## 3. Breakthrough Mini-Game

### 3.1 Flow Diagram

```
/breakthrough
    │
    ▼
[Check Prerequisites]
    │
    ├─ ✓ Đủ tu vi ─► Show options
    ├─ ✗ Heart demon > 80 ─► Warning, suggest purification
    ├─ ✗ Injury level 3+ ─► Block, suggest healing
    └─ ✗ No manual ─► Block, suggest learning
    │
    ▼
[Show Breakthrough Options — ephemeral]
    │
    ├─ [Ổn Định Đột Phá] ─► Rate ×1.0, risk: minor
    ├─ [Cưỡng Ép Đột Phá] ─► Rate ×0.7, risk: severe
    ├─ [Dùng Trúc Mạch Đan] ─► Rate ×1.3, cost: 1 pill
    └─ [Mượn Trận Tông Môn] ─► Rate ×1.5, cost: 50 merit
    │
    ▼
[Confirm + Execute]
    │
    ▼
[Roll Result]
    │
    ├─ Critical Success (roll > 95) ─► Major advancement + public log
    ├─ Normal Success ─► Advancement
    ├─ Minor Failure (roll 10-30) ─► Setback
    └─ Severe Failure (roll < 10) ─► Major setback + injury
```

### 3.2 UI States

**State 1: Prerequisites Check**

```
╔══════════════════════════════════════╗
║     ⚡ ĐỘT PHÁ — Kim Đan Hậu Kỳ      ║
╠══════════════════════════════════════╣
║                                      ║
║  Tu vi: 243,000 / 243,000  ████████  ║
║  ✓ Đủ điều kiện đột phá!            ║
║                                      ║
║  ─────── Trạng thái ───────          ║
║  Căn cơ: 52/100              ✓       ║
║  Tâm ma: 23/100              ✓       ║
║  Thương thương: 0             ✓      ║
║  Công pháp: Thanh Vân Quyết   ✓      ║
║  Vị trí: Linh Khê Cốc          ✓     ║
║                                      ║
║  ════════════════════════════════    ║
║  Tỉ lệ đột phá cơ bản: 75%          ║
║  Tổng tỉ lệ (hiện tại): 72%         ║
║  ════════════════════════════════    ║
║                                      ║
║  Chọn phương thức:                  ║
║                                      ║
║  [1️⃣ Ổn Định Đột Phá]       72%     ║
║      Rủi ro: Thấp                   ║
║                                      ║
║  [2️⃣ Cưỡng Ép Đột Phá]       50%    ║
║      Thưởng: Căn cơ +2 nếu thành    ║
║      Rủi ro: Cao (nội thương)       ║
║                                      ║
║  [3️⃣ Dùng Trúc Mạch Đan]    87%     ║
║      Cần: Trúc Mạch Đan x1          ║
║      Rủi ro: 5% đan độc             ║
║                                      ║
║  [4️⃣ Mượn Trận Tông Môn]    95%     ║
║      Cần: 50 Công huân              ║
║      Thưởng: Căn cơ +3 nếu thành    ║
║      (Thanh Vân Tông)                ║
║                                      ║
╚══════════════════════════════════════╝
```

**State 2: Result — Success**

```
╔══════════════════════════════════════╗
║     🎊 ĐỘT PHÁ THÀNH CÔNG!           ║
╠══════════════════════════════════════╣
║                                      ║
║      ⚡ NGUYÊN ANH SƠ KỲ ⚡          ║
║                                      ║
║  ════════════════════════════════    ║
║  Bạn đã vượt qua cửa ải Kim Đan,   ║
║  huyền quang bùng nổ xung quanh.   ║
║  Nguyên Anh hình thành trong tâm    ║
║  hải, tỏa ra ánh sáng vàng rực rỡ. ║
║  ════════════════════════════════    ║
║                                      ║
║  Căn cơ: 52 → 55 (+3)               ║
║  Tu vi: 0 / 729,000                 ║
║  Max HP: 2,950 → 3,175              ║
║  Max Qi: 1,475 → 1,587              ║
║                                      ║
║  [🔄 Xem Profile]  [📊 So sánh]     ║
╚══════════════════════════════════════╝
```

**State 3: Result — Failure**

```
╔══════════════════════════════════════╗
║     ❌ ĐỘT PHÁ THẤT BẠI             ║
╠══════════════════════════════════════╣
║                                      ║
║  Nguyên Anh của bạn không thể hình   ║
║  thành. Khí huyết đảo lộn, thân     ║
║  thể chịu đựng quá mức.             ║
║                                      ║
║  ════════════════════════════════    ║
║  Tu vi: 243,000 → 218,700 (-10%)    ║
║  Tâm ma: 23 → 38 (+15)              ║
║  Thương thương: 0 → 2 (Nội thương) ║
║  Cooldown: 3 ngày                   ║
║  ════════════════════════════════    ║
║                                      ║
║  Lời khuyên:                        ║
║  • Giảm tâm ma xuống dưới 30        ║
║  • Chữa lành thương thương          ║
║  • Cải thiện căn cơ                  ║
║                                      ║
║  [💊 Mua Thanh Tâm Đan]             ║
║  [🧘 Tu luyện Ổn Định]              ║
╚══════════════════════════════════════╝
```

### 3.3 Breakthrough Roll

```typescript
function resolveBreakthrough(
  character: Character,
  mode: BreakthroughMode,
  pillUsed?: Item,
  sectFormation?: boolean
): BreakthroughResult {
  const baseRate = getRealmBaseRate(character.currentRealm);
  const foundationMultiplier = 1 + (character.foundationQuality / 500);
  const heartDemonPenalty = 1 - (character.heartDemon / 200);
  const injuryPenalty = 1 - (character.injuryLevel * 0.10);
  const locationBonus = character.inSectHQ ? 1.10 : 1.0;

  let successRate = baseRate
    × foundationMultiplier
    × heartDemonPenalty
    × injuryPenalty
    × locationBonus;

  // Mode modifiers
  if (mode === 'forced') successRate *= 0.7;
  if (mode === 'pill' && pillUsed) successRate *= 1.3;
  if (mode === 'sect' && sectFormation) successRate *= 1.5;

  // Clamp to valid range
  successRate = clamp(successRate, 0.01, 0.99);

  // Roll
  const roll = random(0, 1);

  if (roll < successRate * 0.95) {
    // Normal success
    return { outcome: 'success', foundationGain: 3 };
  } else if (roll < successRate) {
    // Critical success
    return {
      outcome: 'critical',
      foundationGain: 6,
      publicLog: true,
      hiddenPotentialChance: 0.10
    };
  } else if (roll < successRate + 0.30) {
    // Minor failure
    return {
      outcome: 'minor_failure',
      cultivationLoss: 0.10,
      cooldownDays: 1
    };
  } else {
    // Severe failure
    return {
      outcome: 'severe_failure',
      cultivationLoss: 0.25,
      injuryLevel: 1 + (mode === 'forced' ? 1 : 0),
      heartDemonGain: 15,
      cooldownDays: 3
    };
  }
}
```

---

## 4. Encounter Mini-Game

### 4.1 Flow

```
/encounter
    │
    ▼
[Check conditions]
    │
    ├─ Cooldown check (if any)
    ├─ Region check
    ├─ Realm requirement check
    └─ Active event check
    │
    ▼
[Roll encounter type]
    │
    ├─ Weighted random based on region, luck, heart demon
    └─ Special event override
    │
    ▼
[Show encounter — ephemeral with public hint]
    │
    ▼
[Player choices]
    │
    ├─ Choice A ─► Effects
    ├─ Choice B ─► Effects
    └─ Choice C ─► Effects
    │
    ▼
[Apply effects + Log]
```

### 4.2 UI States

**State 1: Encounter triggered**

```
╔══════════════════════════════════════╗
║     🔮 KỲ NGỘ — Đại Việt            ║
║     Linh Khê Cốc · Luyện Thể Trung   ║
╠══════════════════════════════════════╣
║                                      ║
║  Trên đường tu luyện, bạn nhìn thấy ║
║  một lão nhân đang ngồi bên suối.   ║
║  Ông ấy mỉm cười và nói:            ║
║                                      ║
║  "Ngươi có duyên với Thanh Vân      ║
║   Quyết. Ta sẽ chỉ cho ngươi một    ║
║   bí quyết nhỏ."                     ║
║                                      ║
║  ════════════════════════════════    ║
║                                      ║
║  [1️⃣ Lễ phép nhận lời chỉ dẫn]       ║
║     → Nhận 500 tu vi bonus          ║
║     → Tâm ma -5                     ║
║                                      ║
║  [2️⃣ Hỏi han lão nhân là ai]        ║
║     → Nhận 1x Thanh Tâm Đan         ║
║     → Mở khóa ẩn tuyến              ║
║                                      ║
║  [3️⃣ Cảm ơn và rời đi]              ║
║     → Danh vọng +2                  ║
║     → Tiếp tục tu luyện             ║
║                                      ║
╚══════════════════════════════════════╝
```

**Public log (if notable):**

```
📢 **Thiên Đạo truyền âm:**
Một tu sĩ vô danh đã gặp được cao nhân
ẩn cư tại Linh Khê Cốc, tiếp nhận thiên
chi sỉ chỉ, tu vi tăng vượt bậc.
```

### 4.3 Encounter Weighting

```typescript
function rollEncounter(
  character: Character,
  region: Region,
  eventActive?: WorldEvent
): Encounter {
  const weights: Record<string, number> = {
    herb_gatherer: 30,
    wild_beast: 25,
    kien_ngo: 20,
    evil_cultist: 10,
    genius: 5,
    ancient_ruins: 10,
  };

  // Modifiers
  if (character.heartDemon > 30) {
    weights.evil_cultist += character.heartDemon;
    weights.kien_ngo -= 5;
  }

  if (character.luck > 50) {
    weights.kien_ngo += 10;
    weights.ancient_ruins += 5;
  }

  if (eventActive?.type === 'treasure_hunt') {
    weights.ancient_ruins += 30;
  }

  // Select encounter
  const encounterType = weightedRandom(weights);
  return loadEncounterData(encounterType, region);
}
```

---

## 5. Combat Mini-Game

### 5.1 Auto-Resolve Flow

```
/combat <target>
    │
    ▼
[Validate combat conditions]
    │
    ├─ Check realm difference
    ├─ Check cooldowns
    └─ Check PvP flags
    │
    ▼
[Initiate combat — public message]
    │
    ▼
[Calculate turn order]
    │
    ├─ Initiative = Speed + random(0, Speed/10)
    └─ Higher goes first
    │
    ▼
[Combat loop until HP <= 0]
    │
    ├─ Attacker deals damage
    ├─ Check crit/dodge/block
    └─ Apply to defender HP
    │
    ▼
[Combat ends]
    │
    ├─ Victory ─► Calculate loot + rewards
    └─ Defeat ─► Apply death check + penalties
    │
    ▼
[Post combat log — public]
```

### 5.2 Combat Log Format

```
⚔️ **TRẬN CHIẾN — Yêu Thú Đồi**

Lý Hàn (Khí Tức Trung) vs Yêu Thú Cấp 2

**Lượt 1**
→ Lý Hàn tấn công: 45 sát thương
   Yêu Thú HP: 155/200
→ Yêu Thú phản công: 22 sát thương
   Lý Hàn HP: 178/200

**Lượt 2**
→ Lý Hàn tấn công: 48 sát thương 💥
   Yêu Thú HP: 107/200
→ Yêu Thú phản công: 20 sát thương
   Lý Hàn HP: 158/200

**Lượt 3**
→ Lý Hàn tấn công: 44 sát thương
   Yêu Thú HP: 63/200
→ Yêu Thú phản công: MISS!

**Lượt 4**
→ Lý Hàn tấn công: 46 sát thương
   Yêu Thú HP: 17/200
→ Yêu Thú phản công: 21 sát thương
   Lý Hàn HP: 137/200

**Lượt 5**
→ Lý Hàn tấn công: 43 sát thương
   Yêu Thú HP: -26/200 💀

═══════════════════════════════════
🎉 **CHIẾN THẮNG!**
• Thu được: 65 Bạc, 1x Yêu Thú Lông
• Tu vi: +50
• Danh vọng: +2
═══════════════════════════════════
```
