# AGENTS.md — Thiên Nam Engine

> Universal agent behavior rules for all AI tools working on this project.

---

## Overview

This file defines behavior rules for every AI agent that touches this codebase: Cursor, Claude Code, Codex, Gemini CLI, OpenCode, and any future agent.

These rules supplement — but do not replace — the Cursor rules in `.cursor/rules/`.

---

## Agent Philosophy

1. **Read before write.** Always read relevant files before editing.
2. **Verify before claiming.** Run typecheck, lint, and test before saying "done."
3. **Respect architecture.** Don't cross layer boundaries (see `.cursor/rules/010-architecture-boundaries.mdc`).
4. **State assumptions.** If you're inferring something, say so.
5. **Keep scope bounded.** Large tasks get split into smaller steps.

---

## Tool Usage

### When to Use Each Tool

| Tool | When |
|------|-------|
| **Read** | Before editing any file |
| **Grep/Glob** | Finding patterns, imports, references |
| **Write/StrReplace** | Making targeted changes |
| **Shell** | Git, npm/pnpm, running scripts |
| **Task** | Parallel work on independent subtasks |
| **Glob** | Finding files by pattern |

### Before Any Edit

1. Read the file you're about to edit
2. Read files it imports
3. Read the Cursor rule that governs it
4. Read the closest test file (if any)

---

## Project-Specific Behaviors

### Code Generation

- **Import `packages/core` directly** — Don't re-implement game logic
- **Use Zod for validation** — Every API input and API response
- **TypeScript strict** — No `any`, explicit types everywhere
- **ESM modules** — Use `.js` in imports
- **Prisma transactions** — Wrap multi-step DB operations

### Lore and Writing

- **Read tone guide first** — `kb/narrative/tone-guide.md`
- **Use Vietnamese imagery** — Dragons, phoenixes, mountains, rivers
- **No western fantasy** — No generic "Qi" spelled "Chi"
- **Public log = narrator voice** — Authoritative, poetic, concise

### Architecture Decisions

- **Check `kb/adr/` first** — Why things are the way they are
- **If changing architecture** — Write or update an ADR
- **Discord is UI only** — No game logic in bot commands

---

## Multi-Agent Coordination

When multiple agents work on the same task:

1. **Primary agent** owns the task and delegates subtasks
2. **Subagents** report results to primary
3. **Primary** assembles, verifies, and commits
4. **Never have two agents editing the same file**

---

## Session Management

- **Summarize progress** at the end of every major step
- **List created/modified files** explicitly
- **State what's blocking** if you can't proceed
- **Don't assume** previous agent's work is correct — verify

---

## Cross-Tool Compatibility

| Agent | Config Location | Notes |
|-------|---------------|-------|
| Cursor | `.cursor/rules/*.mdc` | Primary |
| Claude Code | `AGENTS.md` (this file) | Supplement |
| Codex | `AGENTS.md` + `.cursor/rules/` | Uses Cursor rules |
| Gemini CLI | `AGENTS.md` + `.cursor/rules/` | Reads rules |
| OpenCode | `AGENTS.md` + `.cursor/rules/` | Reads rules |

---

## Rule Precedence

1. `.cursor/rules/010-architecture-boundaries.mdc` — Hard boundaries
2. `.cursor/rules/001-project-constitution.mdc` — Non-negotiables
3. `.cursor/rules/000-agent-behavior.mdc` — Behavioral guardrails
4. `AGENTS.md` — Tool usage and coordination
5. `.cursor/rules/020-*.mdc` through `.cursor/rules/140-*.mdc` — Domain-specific rules

If rules conflict, higher precedence wins.

---

## Skill Invocation

Skills in `.agents/skills/` can be invoked by any agent:

```
When to invoke a skill:
- Building game engine → thien-nam-game-engineer
- Creating lore → thien-nam-worldbuilder
- Writing narrative → xianxia-narrative-writer
- Designing quests/events → quest-event-designer
- Working with database → prisma-database-engineer
- Building admin panel → admin-panel-engineer
- Writing tests → testing-reviewer
- Security audit → security-auditor
```

See individual skill files for detailed workflow.
