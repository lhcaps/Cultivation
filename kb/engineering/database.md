# Database Schema — Thiên Nam Engine

> Database design decisions and patterns.

---

## Schema Design Philosophy

1. **Every entity is a model** — No join tables for simple relationships
2. **Explicit relations** — Always use named relation fields
3. **Audit everything** — ActionLog on every player action, AdminAuditLog on every admin mutation
4. **Seed data in DB** — No hardcoded game content

---

## Key Models

### User → Character

One Discord user can have multiple characters. Character owns all game state.

### Character → Realm/Region/Sect/Manual

Many-to-one relations. Realm/Region/Sect are seeded data. Character references by ID.

### ActionLog

Append-only log. Created on every player action. Used for:
- Player history (`/logs`)
- Anti-cheat analysis
- Balance tuning

### AdminAuditLog

Append-only audit. Created on every admin mutation. Used for:
- Accountability
- Dispute resolution
- Compliance

---

## Transaction Patterns

### Character Creation

```typescript
await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({ data: { discordId, username } });
  const character = await tx.character.create({ data: { userId: user.id, ... } });
  await tx.actionLog.create({ data: { characterId: character.id, action: "CHARACTER_CREATED" } });
});
```

### Cultivation

```typescript
await prisma.$transaction(async (tx) => {
  await tx.character.update({ where: { id }, data: { cultivationPoints: { increment: points } } });
  await tx.cultivationSession.create({ data: { characterId: id, ... } });
  await tx.actionLog.create({ data: { characterId: id, action: "CULTIVATE", publicLog: false } });
});
```

---

## Index Strategy

| Model | Indexes |
|-------|---------|
| Character | `userId`, `realmId`, `sectId` |
| ActionLog | `characterId`, `action`, `createdAt` |
| AdminAuditLog | `adminId`, `action`, `targetType+targetId`, `createdAt` |
| Cooldown | `[characterId, type]` (unique) |
