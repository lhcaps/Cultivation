# Discord Interaction Patterns — Thiên Nam Engine

## Interaction Types

| Type | Handler | Timeout |
|------|---------|---------|
| Slash command | Pre-registered | 3s to ACK |
| Button | custom_id listener | 3s to ACK |
| Select menu | custom_id listener | 3s to ACK |
| Modal | First response only | No defer |

## custom_id Pattern

```
domain:action:entityId:nonce
```

Examples:
```
cultivate:stable:char_abc123:a3f8k2
alchemy:fire_round_2:char_abc123:x9m2p4
breakthrough:forced:char_abc123:r7t1w3
```

## Defer First, Always

```typescript
// Always defer before any async work
await interaction.deferReply({ ephemeral: true });

// Then editReply with result
await interaction.editReply({ content: "Kết quả...", components: [] });
```

## User Validation

```typescript
const character = await getCharacterByUserId(interaction.user.id);
if (character.id !== targetId) {
  return interaction.reply({
    content: "Đây không phải nhân vật của ngươi.",
    flags: MessageFlags.Ephemeral,
  });
}
```
