---
name: thien-nam-worldbuilder
description: Designs and expands world content: sects, regions, NPCs, factions, and lore for Thiên Nam Engine.
---

# Skill: Thien Nam Worldbuilder

## Purpose

Designs, expands, and maintains world content for Thiên Nam Engine: sects, regions, NPCs, factions, and lore. Every piece of lore must serve gameplay and be compatible with the game's data model.

## When to Use

- Adding a new sect (full profile with all required fields)
- Expanding region descriptions with new locations or NPCs
- Creating faction dynamics or conflict timelines
- Designing an NPC with dialogue options
- Resolving lore contradictions between existing sources
- Pre-Phase 9+ (regions/encounters design)

## Inputs Expected

- Request type: new sect, region expansion, NPC, faction, or conflict
- Target domain: which part of `kb/canon/` or `docs/` to update
- Existing lore context (what already exists)

## Workflow

### Sect Design

1. Read `docs/world-bible.md` for existing sect table
2. Read `kb/canon/sects.md` for sect design standards
3. Read `kb/canon/faction-relations.md` for faction dynamics
4. Fill the required fields:

| Field | Example |
|-------|---------|
| ID | `THANH_VAN_TONG` |
| Name | Thanh Vân Tông |
| Region | Đại Việt |
| Alignment | Chính Đạo |
| Rank | ★★ |
| Headquarters | Thanh Vân Sơn |
| Signature Art | Thanh Vân Kiếm Quyết |
| Specialty | Thủy công, luyện đan |
| Benefits | +10% cultivation, +20% healing |
| Internal Conflict | Old guard vs reformist |
| Enemy | Vạn Độc Giáo |
| Ally | Chính Dương Tông |

5. Write personality description (2-3 sentences)
6. Write origin story (1 paragraph)
7. Verify: no copyrighted IP names, no western fantasy tropes
8. Update `kb/canon/sects.md` and `docs/world-bible.md`
9. If gameplay-affecting, update `packages/db/prisma/seed.ts`

### Region Expansion

1. Read `docs/regions.md` for existing region table
2. Read `kb/canon/regions.md` for extended descriptions
3. Add new locations or NPCs following the region format
4. Verify: geography consistent with Vietnamese landscape
5. Update `kb/canon/regions.md`

### NPC Design

1. Read `kb/canon/sects.md` for sect personality
2. Read `kb/narrative/dialogue-guide.md` for dialogue conventions
3. Fill the required fields:

| Field | Content |
|-------|---------|
| Name | Unique identifier |
| Title | Formal title |
| Affiliation | Sect or independent |
| Location | Where found |
| Role | Quest giver, shop, lore source |
| Personality | 2-3 sentences |
| Voice | How they speak |
| Quirk | One memorable detail |

4. Write 3 sample dialogues using 「」
5. Update `kb/canon/` (relevant section)

## Output Format

- Updated `kb/canon/` files with new content
- If new sect: update `docs/world-bible.md` sect table
- If new data-affecting content: update `packages/db/prisma/seed.ts`
- Summary of what was created

## Quality Bar

- Every sect has all 12 required fields
- Every NPC has all 8 required fields
- No copyrighted IP references
- Vietnamese naming conventions followed
- Prose is Vietnamese literary wuxia tone
- Lore connects to at least one gameplay system
- Files referenced are updated consistently

## Anti-Patterns

- Creating lore disconnected from game systems
- Using western fantasy naming conventions
- Copying sect personalities from existing IP
- Forgetting to update seed data when lore affects gameplay
- Writing lore that contradicts `docs/world-bible.md`
- Skipping faction alignment and relationship fields
- Creating NPCs without sect/region affiliation

## Related Files

- `docs/world-bible.md`
- `docs/regions.md`
- `kb/canon/sects.md`
- `kb/canon/regions.md`
- `kb/canon/faction-relations.md`
- `kb/narrative/tone-guide.md`
- `kb/narrative/dialogue-guide.md`
- `packages/db/prisma/seed.ts`
- `.cursor/rules/090-worldbuilding-lore.mdc`
