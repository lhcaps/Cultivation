# Economy Rules — Thiên Nam Engine

## Currency Values

| Currency | 1 Unit = |
|----------|---------|
| 1 Linh Thạch | 100 Bạc |
| 1 Công Huân | 10 Linh Thạch (sect only) |

## Generation Rates (Active Player/Day)

| Source | Silver | ST | Merit | Rep |
|--------|--------|-----|-------|-----|
| Daily reward | 100 | — | — | — |
| Cultivation | 20-80 | 5% chance | 1 (sect) | — |
| Quest (easy) | 50-200 | — | 5-10 | 5-20 |
| Combat (easy) | 30-100 | 5% | — | 2-5 |

## Sink Rates (Active Player/Day)

| Sink | Cost | Frequency |
|------|------|----------|
| Travel | 10-500 Ag | 2-3/day |
| Repair | 5-50 Ag | Daily |
| Storage | 5 Ag/item | Daily |

## Anti-Exploit Rules

| Pattern | Limit | Response |
|---------|-------|----------|
| Cultivation spam | 6/day | Cooldown doubles |
| Alchemy spam | 10/day | Ingredient shortage |
| Encounter spam | 5/day | Diminishing returns |

## Economy Auto-Correction

```typescript
// Inflation detected (>20k Ag/player avg)
if (avgPlayerSilver > 20_000) {
  dailyReward *= 0.9;
  repairCosts *= 1.1;
}

// Deflation detected (<500 Ag/player avg)
if (avgPlayerSilver < 500) {
  dailyReward *= 1.2;
  repairCosts *= 0.8;
}
```
