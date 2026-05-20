# Architecture Decision Record 0003 — All Actions Are Logged

## Status

Accepted

## Context

We needed accountability for:
1. Player behavior analysis and anti-cheat
2. Admin action accountability ("Thiên Đạo có thiên quy")
3. Dispute resolution
4. Game balance tuning

## Decision

Every player action creates an `ActionLog`. Every admin mutation creates an `AdminAuditLog`. Both are append-only and never deleted.

## Consequences

### Positive

- Full audit trail for every character
- Admin actions are transparent and accountable
- Can analyze player behavior for balance tuning
- Dispute resolution is evidence-based

### Negative

- Database storage grows over time
- Must manage retention policy
- Some performance overhead on writes

## Implementation

```typescript
// Player action — ActionLog
await tx.actionLog.create({
  data: {
    characterId: character.id,
    action: "CULTIVATE",
    details: { mode, points, heartDemon },
    publicLog: false,
  },
});

// Admin mutation — AdminAuditLog
await tx.adminAuditLog.create({
  data: {
    adminId: admin.id,
    adminRole: admin.role,
    action: "ITEM_GIVE",
    targetType: "character",
    targetId: character.id,
    targetName: character.name,
    previousValue: null,
    newValue: { itemId, quantity },
    reason: req.body.reason,
    evidence: req.body.evidence ?? null,
  },
});
```

---

*Decision made: 2024-01-01*
