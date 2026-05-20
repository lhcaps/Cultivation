# Architecture Overview — Thiên Nam Engine

> High-level architecture of the system.

---

## System Diagram

```
                    ┌─────────────────────────────────────────────┐
                    │              Discord Gateway                  │
                    └──────────────────┬──────────────────────────┘
                                       │ WebSocket
                    ┌─────────────────▼──────────────────────────┐
                    │           apps/bot                       │
                    │    discord.js + @sapphire/framework        │
                    │    Commands, Buttons, Selects, Modals      │
                    └─────────────────┬──────────────────────────┘
                                      │ HTTP
                    ┌─────────────────▼──────────────────────────┐
                    │           apps/api                        │
                    │    NestJS REST API                        │
                    │    Modules: character, cultivation, sect   │
                    └─┬───────────────────────┬──────────────────┘
                      │                       │
          ┌───────────▼───────────┐   ┌───▼──────────────────┐
          │    packages/core      │   │    apps/worker         │
          │  Pure TypeScript     │   │  BullMQ Background Jobs│
          │  Zero dependencies   │   │  Daily reset, seclusion│
          │  Game rules         │   └──────────────────────┘
          └───────────┬───────────┘
                      │
          ┌───────────▼───────────────────────────┐
          │          packages/db                     │
          │      Prisma + PostgreSQL               │
          │      Schema + Migrations + Seeds       │
          └───────────────────────────────────────┘

          ┌───────────────────────────────────────┐
          │          Redis                         │
          │    BullMQ Queue + Cache                │
          └───────────────────────────────────────┘

          ┌───────────────────────────────────────┐
          │          apps/admin                      │
          │    Next.js Dashboard                   │
          │    Thiên Đạo Control Surface          │
          └───────────────────────────────────────┘
```

## Key Architectural Decisions

| Decision | ADR | Rationale |
|----------|-----|-----------|
| Discord is client only | ADR-0001 | Future web client without rewrite |
| Core engine is pure TS | ADR-0002 | Testable, portable |
| All actions are logged | ADR-0003 | Audit trail, anti-cheat |

## Layer Responsibilities

| Layer | Responsibility |
|-------|---------------|
| `apps/bot` | Discord UI adapter — receives input, calls API, renders output |
| `apps/api` | Game operations — business logic, transactions |
| `apps/worker` | Background jobs — delayed tasks, scheduled tasks |
| `apps/admin` | Admin control — world management |
| `packages/core` | Game rules — pure functions, no side effects |
| `packages/db` | Data — Prisma schema, migrations, seeds |

## Communication Patterns

| Pattern | Use Case |
|---------|---------|
| HTTP REST | Bot → API, Admin → API |
| BullMQ | API → Worker, Scheduled jobs |
| Redis | Cache, rate limiting, job queue |

## Deployment

| Environment | Components |
|------------|-----------|
| Development | All apps run locally |
| Production | Bot on dedicated host, API + Worker on server, Admin on Vercel |
