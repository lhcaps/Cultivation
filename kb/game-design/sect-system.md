# Sect System Design — Thiên Nam Engine

## Sect Ranks and Benefits

| Rank | ★ | Max Members | Treasury Bonus | Member Cap |
|------|---|-----------|--------------|-------------|
| ★ | Legendary | 10 | 1.5x | Unlimited |
| ★★ | Powerful | 50 | 1.3x | 50 |
| ★★★ | Major | 30 | 1.2x | 30 |
| ★★★★ | Minor | 20 | 1.1x | 20 |
| ★★★★★ | Established | 10 | 1.0x | 10 |

## Member Benefits

| Benefit | Effect |
|---------|--------|
| Cultivation aura | +10% cultivation speed |
| Alchemy bonus | +10% pill quality |
| Defense formation | -10% damage in sect HQ |
| Transport | Free travel to sect locations |
| Treasury access | Leader distributes resources |

## Contribution System

| Action | Merit Gained |
|--------|-------------|
| Daily cultivation | +1 |
| Sect mission (easy) | +5-10 |
| Sect mission (hard) | +20-50 |
| Defend sect | +20 |
| Kill enemy faction | +15 |
| War victory | +30 |

## Salary System

```
weeklySalary = min(treasury / (members × 4), 100 × rankMultiplier)
```
Treasury lasts 4 weeks at recommended salary.
