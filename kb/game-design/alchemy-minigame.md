# Alchemy Mini-Game Design — Thiên Nam Engine

## Core Loop

```
1. Select recipe (select menu)
2. Verify ingredients (confirmation)
3. Five rounds of fire control (buttons)
4. Calculate quality
5. Apply result
```

## Fire Control Round Mechanics

Each round presents 3 choices. Choices affect Stability Meter (0-100).

### Round 1: Ignite Cauldron

| Choice | Stability | Output | Qi Cost |
|--------|-----------|--------|---------|
| Tiểu Hỏa | +10 | -5 | 5 |
| Trung Hỏa | +5 | 0 | 10 |
| Đại Hỏa | 0 | +10 | 20 |

### Round 2: Dissolve Ingredients

| Choice | Stability | Output | Qi Cost |
|--------|-----------|--------|---------|
| Giữ nhiệt | +5 | -5 | 5 |
| Tăng nhiệt | 0 | +5 | 15 |
| Hạ nhiệt | +10 | -10 | 5 |

### Round 3: Filter Impurities

| Choice | Stability | Purity | Qi Cost |
|--------|-----------|--------|---------|
| Ổn định | +5 | +5 | 5 |
| Mạnh tay | -5 | +10 | 20 |
| Dùng thần thức | 0 | +5 | 25 |

### Round 4: Condense Pill

| Choice | Stability | Output | Qi Cost |
|--------|-----------|--------|---------|
| Nhanh | -10 | +15 | 10 |
| Chậm | +5 | -5 | 10 |
| Cực chậm | +10 | -10 | 10 |

### Round 5: Open Cauldron

| Choice | Stability | Output | Qi Cost |
|--------|-----------|--------|---------|
| Cưỡng khai | -15 | +20 | 15 |
| Ổn khai | 0 | 0 | 5 |
| Chờ thêm | +10 | -10 | 0 |

## Quality Thresholds

| Quality | Stability | Purity |
|---------|-----------|--------|
| **Cực Phẩm** | 90+ | 80+ |
| **Thượng Phẩm** | 75+ | 60+ |
| **Trung Phẩm** | 50+ | 40+ |
| **Hạ Phẩm** | 25+ | — |
| **Thất Bại** | <25 | — |

## Đan Kiếp

5% chance on Cực Phẩm. Survival = 50% + (FQ / 2).

Win: Bonus rewards + public log.
Lose: Ingredients lost + injury + heart demon +10.
