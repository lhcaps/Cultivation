# Thiên Nam Engine

> *Thiên Đạo quyết: Mọi quy tắc trong thế giới này được ghi chép đầy đủ.*

A Discord-first cultivation RPG built with TypeScript, featuring a monorepo architecture separating game logic from the Discord client.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Discord Bot** | discord.js + @sapphire/framework |
| **Game Engine** | TypeScript (pure functions, zero deps) |
| **API** | NestJS |
| **Database** | PostgreSQL + Prisma |
| **Queue** | Redis + BullMQ |
| **Admin Panel** | Next.js + shadcn/ui |
| **Package Manager** | pnpm |
| **Build Tool** | Turbo |

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker + Docker Compose

### Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Start database and redis
docker compose up -d

# 3. Generate Prisma client
pnpm db:generate

# 4. Push schema to database
pnpm db:push

# 5. Seed initial data
pnpm db:seed

# 6. Start development servers
pnpm dev
```

### Environment Variables

Copy `.env.example` to `.env` and fill in:

```bash
cp .env.example .env
```

Required variables:
- `DISCORD_TOKEN` — Your Discord bot token
- `DATABASE_URL` — PostgreSQL connection string
- `REDIS_URL` — Redis connection string

## Project Structure

```
thien-nam-engine/
├── apps/
│   ├── bot/           # Discord client (Sapphire commands + interactions)
│   ├── api/           # NestJS REST API
│   ├── admin/         # Next.js admin dashboard
│   └── worker/        # BullMQ background job workers
├── packages/
│   ├── core/          # Pure game engine (no external deps)
│   │   └── src/
│   │       ├── constants/   # Game constants (realms, combat, economy)
│   │       ├── types/      # Zod schemas + TypeScript interfaces
│   │       ├── rules/      # Pure game logic (cultivation, breakthrough, alchemy)
│   │       └── calculators/ # Re-exports from rules
│   ├── db/            # Prisma schema + migrations + seeds
│   └── ui-shared/     # Shared UI utilities
├── docs/              # World Bible, game rules, balancing docs
└── docker-compose.yml
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in dev mode |
| `pnpm dev:bot` | Start Discord bot only |
| `pnpm dev:api` | Start API only |
| `pnpm dev:admin` | Start admin panel only |
| `pnpm db:seed` | Seed database with initial data |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm build` | Build all apps |
| `pnpm test` | Run all tests |
| `pnpm lint` | Lint all packages |

## Discord Commands

| Command | Description |
|---------|-------------|
| `/start` | Create a new character |
| `/profile` | View character stats |
| `/cultivate` | Start a cultivation session |
| `/breakthrough` | Attempt realm advancement |
| `/alchemy` | Open alchemy mini-game |
| `/encounter` | Trigger a random encounter |
| `/sect` | View/join sect |
| `/travel` | Move between regions |
| `/help` | List all commands |

## Architecture Highlights

### Game Engine First

All game rules live in `packages/core` as pure TypeScript functions with zero external dependencies. The Discord bot never contains game logic — it only handles UI.

```
Discord interaction → Bot adapter → Game Engine (core) → API/DB → UI update
```

### Ephemeral UI

Personal menus use Discord's ephemeral messages so only the player sees their choices:

```
Cultivation menu → Button click → Game Engine → Private result embed
```

Public logs are only sent for notable events (breakthrough success, Cực Phẩm alchemy, top leaderboard changes).

### Modular Database

- Realms, regions, sects are **seed data**, not hardcoded
- Every item has a database entry with effects defined in JSON
- Encounters are data-driven with weighted random selection

## Documentation

- [World Bible](docs/world-bible.md) — Lore, cosmology, factions
- [Realms & Progression](docs/realms.md) — All 10 cultivation realms
- [Regions & Map](docs/regions.md) — 8 regions with locations
- [Game Rules](docs/rules.md) — Core gameplay systems
- [Minigames](docs/minigames.md) — UI flows for cultivate/breakthrough/alchemy
- [Economy](docs/economy.md) — Currency and item economy
- [Balancing](docs/game-balancing.md) — Game balance philosophy and metrics
- [Admin Rules](docs/admin-rules.md) — Admin operations and audit requirements

## License

Private project.
