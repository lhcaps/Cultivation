---
name: quest-event-designer
description: Designs quests and events with both narrative text and game data for Thiên Nam Engine.
---

# Skill: Quest and Event Designer

## Purpose

Designs quests and events for Thiên Nam Engine. Every quest and event is dual-natured: it has narrative text (lore) and game data (JSON/TypeScript). Both must be created together and be internally consistent.

## When to Use

- Creating a new world event (server-wide, regional, or personal)
- Designing a quest chain
- Creating encounter templates for regions
- Planning a seasonal event
- Adding a new quest type

## Inputs Expected

- Event type: WORLD_BOSS, SEASON, MINIGAME, LORE, REGIONAL_BOSS, ENCOUNTER, QUEST
- Scope: SERVER, REGION, SECT, PERSONAL
- Duration and timing
- Target player level (realm range)
- Reward budget (economy check)

## Workflow

### Event Design

1. Read `kb/game-design/event-schema.md` for the full JSON schema
2. Read `kb/game-design/player-loop.md` to understand engagement
3. Read `kb/narrative/tone-guide.md` for narrative style
4. Write narrative (lore text) first:

   - Announcement (2-4 sentences, establishes world context)
   - Progress messages (1-2 sentences each, 3-5 max)
   - Completion summary (2-3 sentences)

5. Define game data following schema:

```typescript
interface WorldEvent {
  id: string;              // kebab-case
  name: string;           // Vietnamese name
  type: EventType;        // WORLD_BOSS | SEASON | MINIGAME | LORE
  scope: Scope;            // SERVER | REGION | SECT | PERSONAL
  region?: RegionId;
  faction?: FactionId;
  startAt: Date;
  endAt: Date;

  narrative: {
    announcement: string;
    progress?: string[];
    completion: string;
    failure?: string;
  };

  data: {
    effects: EventEffect[];
    rewards: EventReward[];
    requirements: EventRequirement;
  };
}
```

6. Economy check: verify rewards don't break economy (see `kb/game-design/economy-rules.md`)
7. Write admin preview (Discord embed mock for admin panel)
8. Create ADR if event introduces new mechanics

### Quest Design

1. Read `kb/game-design/quest-schema.md` for JSON schema
2. Read `kb/game-design/player-loop.md` for quest placement
3. Define quest type: ESCORT | HUNT | GATHER | INVESTIGATE | MANHUNT | SECT | HIDDEN
4. Write narrative:

   - Hook (how introduced)
   - Objective (clear, actionable)
   - Completion (rewarding)
   - Failure (if applicable)

5. Define game data:

```typescript
interface Quest {
  id: string;
  name: string;
  type: QuestType;
  narrative: { hook, objective, completion, failure? };
  requirements: { realmMin?, itemRequired?, questCompleted? };
  duration: { type: "INSTANT" | "TIMED" | "ONGOING"; hours? };
  risk: "NONE" | "LOW" | "MEDIUM" | "HIGH";
  rewards: QuestReward[];
  impact?: { factionRelations?, unlocksQuest?, closesQuest? };
}
```

6. Economy check: rewards vs risk
7. Verify: quest is achievable in the time limit
8. Check: quest doesn't conflict with existing quests

### Encounter Design

1. Read `kb/game-design/quest-schema.md` for encounter structure
2. Follow scene template from `kb/narrative/tone-guide.md`
3. Design 2-4 choices with:
   - Clear narrative justification
   - Hidden effects (reward + risk)
   - No "obviously correct" choice
4. Verify realm requirements for locked options

## Output Format

- Narrative text ready for database
- JSON/TypeScript object for game data
- Admin preview embed
- Economy impact assessment
- Updated `kb/` files

## Quality Bar

- Narrative matches game data exactly
- Rewards don't break economy
- Duration appropriate for content
- All required schema fields filled
- Rollback plan documented
- Preview available in admin panel
- Public log text under 500 characters

## Anti-Patterns

- Writing narrative before thinking about game data
- Rewards that would cause inflation
- Events with no failure state when they should have one
- Quests with no clear objective
- Events longer than 30 days (player fatigue)
- Rewards that favor hardcore players too heavily
- Encounter choices with no meaningful trade-offs
- Copying event structure from existing IP

## Related Files

- `kb/game-design/event-schema.md`
- `kb/game-design/quest-schema.md`
- `kb/game-design/player-loop.md`
- `kb/game-design/economy-rules.md`
- `kb/narrative/tone-guide.md`
- `kb/canon/regions.md`
- `kb/canon/sects.md`
- `.cursor/rules/110-quest-event-design.mdc`
- `.cursor/rules/120-game-balance-economy.mdc`
