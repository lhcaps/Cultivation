---
name: prisma-database-engineer
description: Designs and implements database schema, queries, and transactions for Thiên Nam Engine.
---

# Skill: Prisma Database Engineer

## Purpose

Designs and implements database schema, Prisma queries, transactions, and seed data for Thiên Nam Engine. All database operations go through Prisma with proper transaction handling and audit logging.

## When to Use

- Adding a new database model
- Creating a new query or aggregation
- Writing a transaction for a multi-step operation
- Creating or updating seed data
- Writing database migrations
- Optimizing slow queries

## Inputs Expected

- Model to create or modify
- Fields and relations
- Index requirements
- Query patterns needed
- Seed data (if applicable)

## Workflow

### New Model

1. Read `packages/db/prisma/schema.prisma` for existing patterns
2. Read `.cursor/rules/040-prisma-database.mdc` for schema design rules
3. Add model to schema:

```prisma
model WorldEvent {
  id          String      @id @default(cuid())
  name        String
  type        EventType
  scope       EventScope
  regionId    String?
  factionId   String?
  startAt     DateTime
  endAt       DateTime

  // Narrative JSON (stored as text)
  narrative   Json

  // Relations
  region      Region?     @relation(fields: [regionId], references: [id])
  faction     Faction?    @relation(fields: [factionId], references: [id])

  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  @@index([regionId])
  @@index([startAt, endAt])
}
```

4. Generate migration: `pnpm --filter @thien-nam/db migrate dev --name add_world_event`
5. Write seed update if needed

### Transaction Pattern

```typescript
// Character creation
await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({ data: { discordId, username } });
  const character = await tx.character.create({
    data: {
      userId: user.id,
      name: characterName,
      realmId: "LUYEN_THE",
      regionId: "DAI_VIET",
      // ... default values
    },
  });
  await tx.actionLog.create({
    data: {
      characterId: character.id,
      action: "CHARACTER_CREATED",
      publicLog: false,
    },
  });
  return character;
});
```

### Race Condition Prevention

```typescript
// WRONG
const existing = await prisma.cooldown.findUnique({ where: { characterId_type: { characterId, type } } });
if (existing && existing.expiresAt > new Date()) throw new Error("Cooldown active");

// RIGHT
const result = await prisma.cooldown.upsert({
  where: { characterId_type: { characterId, type } },
  create: { characterId, type, expiresAt: newExpires },
  update: {
    where: { characterId_type: { characterId, type } },
    data: { expiresAt: newExpires },
  },
});
```

### Seed Data

1. Read `packages/db/prisma/seed.ts` for existing pattern
2. Use upsert for idempotency:

```typescript
await prisma.worldEvent.upsert({
  where: { id: "world-boss-default" },
  update: {},
  create: {
    id: "world-boss-default",
    name: "Hải Vương Trỗi Dậy",
    type: "WORLD_BOSS",
    scope: "SERVER",
    startAt: new Date(),
    endAt: addDays(new Date(), 3),
    narrative: { /* ... */ },
  },
});
```

### Migration

```bash
# Create
pnpm --filter @thien-nam/db migrate dev --name descriptive_name

# Apply in production
pnpm --filter @thien-nam/db migrate deploy
```

## Output Format

- Updated `packages/db/prisma/schema.prisma`
- New migration file in `packages/db/prisma/migrations/`
- Updated `packages/db/prisma/seed.ts` (if applicable)
- Updated `packages/db/src/index.ts` (if new service)

## Quality Bar

- Every model has `@id`, `createdAt`, `updatedAt`
- Every foreign key has an index
- All multi-step operations use `$transaction`
- Race conditions prevented with upsert
- Audit logs created for all mutations
- Seed data uses upsert (idempotent)
- No raw SQL unless absolutely necessary
- Migration is backward-compatible

## Anti-Patterns

- Check-then-update (race condition)
- Forgetting indexes on foreign keys
- Not wrapping multi-step operations in transactions
- Modifying existing migrations
- Raw SQL without review
- Skipping audit logs
- Non-idempotent seed data

## Related Files

- `packages/db/prisma/schema.prisma`
- `packages/db/prisma/seed.ts`
- `packages/db/prisma/migrations/`
- `packages/db/src/index.ts`
- `.cursor/rules/040-prisma-database.mdc`
- `.cursor/rules/080-security-and-audit.mdc`
