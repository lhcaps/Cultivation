---
name: thien-nam-skill-writer
description: Creates SKILL.md files for Thiên Nam Engine following the project's skill format.
---

# Skill: Thien Nam Skill Writer

## Purpose

Creates new `.agents/skills/*/SKILL.md` files following Thiên Nam Engine's format. Use this when the project needs a new skill for a role not yet covered.

## When to Use

- Project needs a skill for a new role (e.g., "music designer", "QA reviewer")
- An existing skill needs to be updated
- Migrating knowledge from a completed phase into a reusable skill

## Inputs

- Skill name (e.g., `narrative-writer`)
- Skill purpose (one sentence)
- Use cases (what triggers this skill)
- Domain files (what knowledge to pull from)

## Workflow

1. Check existing skills in `.agents/skills/` to avoid duplication
2. Check `docs/` and `kb/` for domain knowledge
3. Write SKILL.md following the format:

```
---
name: [skill-name]
description: [one sentence]
---

# Skill: [Display Name]

## Purpose
[What this skill does]

## When to Use
[Trigger conditions]

## Inputs Expected
[What inputs the agent should expect]

## Workflow
[Step-by-step workflow]

## Output Format
[What to produce]

## Quality Bar
[What "done" means]

## Anti-Patterns
[Common mistakes to avoid]

## Related Files
[KB and docs references]
```

4. Verify under 500 lines
5. No scripts in the skill file
6. No external URLs

## Output Format

A complete `.agents/skills/[skill-name]/SKILL.md` file.

## Quality Bar

- Under 500 lines
- YAML frontmatter present
- All 8 sections filled
- No scripts
- No external URLs
- Uses project terminology (realm names, currency names, etc.)
- References actual files in the project

## Anti-Patterns

- Creating skills for roles already covered
- Copying skill text from external repos verbatim
- Adding scripts that run automatically
- Including auto-update behavior
- Adding broad permissions
- Using vague descriptions instead of specific triggers

## Related Files

- `.cursor/rules/000-agent-behavior.mdc`
- `.cursor/rules/140-documentation-and-kb.mdc`
- `AGENTS.md`
- Existing skills in `.agents/skills/`
