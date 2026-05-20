# Admin Panel Design — Thiên Nam Engine

## Pages

| Page | Purpose |
|------|---------|
| `/dashboard` | Overview, active players, economy health |
| `/players` | Search, view, manage players |
| `/characters/[id]` | Full character detail |
| `/sects` | Sect list, treasury, members |
| `/events` | Create, edit, end events |
| `/audit` | Admin audit log browser |
| `/economy` | Currency circulation, adjustments |

## Event Creation Flow

```
1. Basic info (name, type, dates)
2. Effects (buffs, spawns, unlocks)
3. Rewards (items, currency, titles)
4. Requirements (realm, region, faction)
5. Preview (full JSON + Discord embed mock)
6. Publish → Creates WorldEvent + BullMQ jobs
```

## Form Requirements

Every mutation form requires:
- Reason field (required, min 10 chars)
- Evidence field (optional URL)
- Preview before confirm
- Confirmation dialog
- Auto-logs to AdminAuditLog
