# Breakthrough System — Thiên Nam Engine

## Options and Trade-offs

| Option | Rate | FQ Gain | Risk |
|--------|------|---------|------|
| Ổn Định | base | +3 | Minor |
| Cưỡng Ép | base × 0.7 | +5 | Severe: +2 injury, +15 HD |
| Dùng Đan | base × 1.3 | +4 | 5% pill poison |
| Mượn Trận | base × 1.5 | +6 | None |

## Rate Formula

```
actualRate = baseRate
  × foundationMultiplier    // +1% per 5 FQ
  × heartDemonPenalty    // -0.5% per HD
  × injuryPenalty        // -10% per level
  × locationBonus       // +10% at sect HQ
```

## Prerequisites

- Cultivation 100% full
- Heart demon < 80
- Injury level < 3
- Has manual

## Outcomes

| Roll Range | Outcome | Effect |
|-----------|---------|--------|
| < rate × 0.95 | Normal success | +1 realm, +3 FQ |
| < rate | Critical success | +1 realm, +6 FQ, public log |
| < rate + 0.30 | Minor failure | -10% cultivation, +5 HD |
| >= rate + 0.30 | Severe failure | -25% cultivation, +15 HD, +1-2 injury |
