# Worker Jobs — Thiên Nam Engine

## Scheduled Jobs

| Job | Schedule | Handler |
|-----|----------|---------|
| `daily-reset` | Daily 00:00 UTC | Apply daily rewards |
| `heart-demon-decay` | Daily 00:00 UTC | -1 HD per character |
| `sect-salary` | Weekly Sunday 00:00 UTC | Distribute salaries |
| `world-event-expiry` | Every 15 min | End expired events |
| `leaderboard-refresh` | Every hour | Recalculate rankings |

## Delayed Jobs

| Job | Trigger | Handler |
|-----|---------|---------|
| `seclusion-complete` | Cultivation SECLUSION | Apply rewards |
| `alchemy-complete` | Alchemy finish | Apply result |
| `world-boss-despawn` | Boss spawn | Remove boss |

## Idempotency

```typescript
// Check before write
const updated = await prisma.character.updateMany({
  where: {
    id: characterId,
    lastDailyClaimedAt: { lt: todayStart },
  },
  data: { lastDailyClaimedAt: new Date() },
});
if (updated.count === 0) return { skipped: true };
```
