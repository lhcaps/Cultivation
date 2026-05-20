---
name: xianxia-narrative-writer
description: Writes narrative text for Thiên Nam Engine: public logs, NPC dialogue, scene descriptions, and event text.
---

# Skill: Xianxia Narrative Writer

## Purpose

Writes in-world narrative text for Thiên Nam Engine: public log announcements, NPC dialogue, scene descriptions, encounter text, and event narratives. All text must match the Vietnamese xianxia/wuxia tone and be compatible with game data.

## When to Use

- Writing public log messages (breakthrough, alchemy, world events)
- Creating NPC dialogue for encounters or events
- Writing scene descriptions for encounters
- Drafting event narrative (announcement, progress, completion)
- Writing quest text (hook, objective, completion, failure)
- Reviewing existing narrative for tone consistency

## Inputs Expected

- Event type: public log, NPC dialogue, scene, encounter, quest, world event
- Character/sect context: names, realm, faction, region
- Game data: what happened mechanically (for consistency)
- Tone preference: narrator, dialogue, dramatic, somber

## Workflow

### Public Log Message

1. Read `kb/narrative/tone-guide.md` for narrator voice
2. Read relevant examples in `kb/canon/` (e.g., breakthrough = `kb/game-design/breakthrough-system.md`)
3. Check tone in `docs/world-bible.md` for faction-specific voice
4. Write under 500 characters
5. Verify: no game mechanics visible in text
6. Verify: matches faction personality (Chính Đạo = formal, U Minh = cryptic)

Template:
```
📢 Thiên Đạo truyền âm:
[Name] đã [action] tại [location].
[1-2 sentences poetic description]
[Moral or narrative note]
```

### NPC Dialogue

1. Read `kb/narrative/dialogue-guide.md` for honorifics and voice
2. Check sect personality in `kb/canon/sects.md`
3. Use 「」 for dialogue, no speech tags
4. Write 2-4 exchanges
5. Verify: honorifics match relationship (elder vs peer vs junior)
6. Verify: vocabulary matches sect/region

### Scene Description

1. Read `kb/narrative/tone-guide.md`
2. Follow scene template:

```
**Setup:** (1-2 sentences)
↓
**Detail:** (1-2 sensory sentences)
↓
**Choice/Action:** (What player encounters)
↓
**Consequence:** (Outcome based on choice)
```

3. Keep each section under 3 sentences
4. Use Vietnamese imagery (núi, sông, mây, rừng)

### Event Narrative

1. Read `kb/game-design/event-schema.md` for structure
2. Write announcement (2-4 sentences establishing lore context)
3. Write progress messages (1-2 sentences each, escalate tension)
4. Write completion (2-3 sentences summary)
5. Verify: narrative matches event data (rewards, duration, scope)

## Output Format

Narrative text, ready to paste into:
- Public log embed
- Encounter scene file
- Event database record
- Quest database record

## Quality Bar

- Under character limits (public log: 500, scene: varies)
- No game mechanics visible in narrative text
- Correct honorifics and address forms
- Matches sect/faction personality
- Uses Vietnamese imagery, not western fantasy
- Active verbs, no -ly adverbs
- Consistent with `docs/world-bible.md` and `kb/canon/`
- Reads well aloud

## Anti-Patterns

- Exposition dumps (no backstory in public logs)
- Western fantasy idioms ("dark lord", "chosen one")
- Direct references to game mechanics in narrative
- Purple prose (evocative but not overwritten)
- Inconsistent honorifics within same dialogue
- Forgetting to check faction personality
- Using "Chi" instead of "Khí"
- Western names in Vietnamese setting

## Related Files

- `kb/narrative/tone-guide.md`
- `kb/narrative/dialogue-guide.md`
- `kb/canon/sects.md` (sect personalities)
- `kb/canon/faction-relations.md` (faction voice)
- `kb/game-design/event-schema.md`
- `kb/game-design/quest-schema.md`
- `.cursor/rules/100-narrative-writing.mdc`
