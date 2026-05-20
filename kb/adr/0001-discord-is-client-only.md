# Architecture Decision Record 0001 — Discord is a Client Adapter

## Status

Accepted

## Context

We needed to decide how to structure the application so that:
1. Game logic is testable without Discord
2. A future web client can reuse game logic
3. The bot doesn't become a tangled mess of business logic

## Decision

The Discord bot will be a pure UI adapter. It receives interactions, calls the API, and renders responses. All game logic lives in `packages/core` as pure TypeScript functions.

## Consequences

### Positive

- Game logic is completely testable (pure functions, no Discord dependency)
- Web client can reuse the same core engine
- Bot stays simple and focused on UX
- Admin panel can share the same API

### Negative

- Every bot action requires an HTTP API call (latency)
- More infrastructure required (API server must be up for bot to work)
- Two systems to maintain instead of one

## Alternatives Considered

### Bot contains game logic directly

Rejected: Would require rewriting all game logic for a web client. Would make unit testing impossible.

### Bot imports core directly (no API)

Partially rejected: API provides better audit trail and allows admin panel to call same logic. Simpler initially but less flexible long-term.

---

*Decision made: 2024-01-01*
