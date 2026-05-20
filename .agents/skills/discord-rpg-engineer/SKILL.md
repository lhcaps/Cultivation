---
name: discord-rpg-engineer
description: Builds Discord bot commands and interactions using @sapphire/framework for Thiên Nam Engine.
---

# Skill: Discord RPG Engineer

## Purpose

Builds Discord bot commands, button handlers, select menu handlers, and modal handlers for Thiên Nam Engine. The bot is a UI adapter — it receives input, calls the API, and renders output. No game logic goes in the bot.

## When to Use

- Creating a new slash command
- Adding button interactions for a mini-game
- Building a select menu for lists
- Creating a modal for text input
- Refactoring existing commands
- Adding ephemeral/persistent UI patterns

## Inputs Expected

- Command/interaction type (slash, button, select, modal)
- Game action to perform (cultivate, breakthrough, alchemy, etc.)
- API endpoint to call
- UI to render (embed, action rows, modals)

## Workflow

### Slash Command

1. Read `apps/bot/src/commands/` for existing patterns
2. Read `apps/bot/src/utils/interaction.ts` for helpers
3. Read `.cursor/rules/020-discord-bot-ui.mdc` for UI standards
4. Create command file at `apps/bot/src/commands/[name].ts`:

```typescript
import { Command } from "@sapphire/framework";
import { MessageFlags } from "discord.js";

export class CultivateCommand extends Command {
  public constructor(ctx: Command.Context) {
    super(ctx, { name: "cultivate", description: "Tu luyện" });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName("cultivate")
        .setDescription("Tu luyện tại Thiên Đạo")
    );
  }

  public async chatInputRun(
    interaction: Command.ChatInputCommandInteraction
  ) {
    // 1. Defer immediately
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    // 2. Validate user owns a character
    const character = await api.getCharacterByDiscordId(interaction.user.id);
    if (!character) {
      return interaction.editReply({ content: "Ngươi chưa có nhân vật. Dùng /start trước." });
    }

    // 3. Check cooldown
    if (character.cooldowns.cultivate > Date.now()) {
      return interaction.editReply({ content: "Hãy nghỉ ngơi trước khi tiếp tục tu luyện." });
    }

    // 4. Call API
    const result = await api.cultivate(character.id);

    // 5. Render result
    await interaction.editReply({ embeds: [renderCultivateResult(result)] });
  }
}
```

5. Register in `apps/bot/src/index.ts`
6. Write tests in `apps/bot/src/commands/[name].test.ts`

### Button Handler

1. Read `apps/bot/src/interactions/buttons.ts` for existing patterns
2. Follow `custom_id` pattern: `{domain}:{action}:{entityId}:{nonce}`
3. Validate user owns the target:

```typescript
export async function handleCultivateButton(interaction: ButtonInteraction) {
  const customId = parseCustomId(interaction.customId);

  // Validate ownership
  const character = await api.getCharacterByDiscordId(interaction.user.id);
  if (character.id !== customId.entityId) {
    return interaction.reply({
      content: "Đây không phải nhân vật của ngươi.",
      flags: MessageFlags.Ephemeral,
    });
  }

  // Handle action
  const result = await api.resolveCultivationAction(character.id, customId.action);
  await interaction.reply({ embeds: [renderResult(result)], flags: MessageFlags.Ephemeral });
}
```

4. Add to button listener registry in `apps/bot/src/interactions/buttons.ts`

### UI Rendering

1. Read `apps/bot/src/utils/interaction.ts` for render helpers
2. Use `EmbedBuilder` from discord.js
3. Follow color scheme from `.cursor/rules/020-discord-bot-ui.mdc`:

| Category | Color |
|----------|-------|
| Cultivation | 0x9966ff |
| Breakthrough | 0xffcc00 |
| Alchemy | 0xff6600 |
| Combat | 0xff3333 |
| Success | 0x00ff00 |

4. Always include footer: `Thiên Nam Võ Lục`
5. Use ephemeral for personal UI, public for world events

## Output Format

- New/updated command file in `apps/bot/src/commands/`
- Button/select handlers in `apps/bot/src/interactions/`
- Render helpers in `apps/bot/src/utils/interaction.ts`
- Registered in `apps/bot/src/index.ts`

## Quality Bar

- All interactions defer first
- Every button/select validates `interaction.user.id` matches character owner
- `custom_id` follows `{domain}:{action}:{entityId}:{nonce}` pattern
- No game logic in the bot (all logic via API)
- Ephemeral for personal UI
- Error messages are Vietnamese and actionable
- Tests cover happy path and user validation

## Anti-Patterns

- Not deferring before async work
- Forgetting to validate user ownership
- Storing game logic in command files
- Calling Prisma directly from bot
- Using ephemeral on public event announcements
- Putting business logic in button handlers
- Hardcoding realm names, item names, sect names

## Related Files

- `apps/bot/src/commands/`
- `apps/bot/src/interactions/buttons.ts`
- `apps/bot/src/utils/interaction.ts`
- `apps/bot/src/lib/client.ts`
- `.cursor/rules/010-architecture-boundaries.mdc`
- `.cursor/rules/020-discord-bot-ui.mdc`
- `.cursor/rules/080-security-and-audit.mdc`
