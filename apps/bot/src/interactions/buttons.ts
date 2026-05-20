/**
 * Interaction handlers — buttons and select menus.
 */
import { Listener, container } from "@sapphire/framework";
import { type ButtonInteraction, EmbedBuilder, MessageFlags } from "discord.js";
import { EmbedColors, parseCustomId } from "../utils/interaction.js";
import {
  resolveCultivation,
  canCultivate,
} from "@thien-nam/core/rules/cultivation.js";

export class ButtonInteractionListener extends Listener {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
      event: "interactionCreate",
    });
  }

  public async run(interaction: ButtonInteraction) {
    if (!interaction.isButton()) return;

    const parts = parseCustomId(interaction.customId);
    if (!parts) return;

    // Only respond to our own buttons
    if (!interaction.customId.startsWith("cultivate:")) return;

    const { action, subAction, targetId } = parts;
    if (action !== "cultivate") return;

    // Validate user owns this character
    const discordUserId = interaction.user.id;
    const user = await container.db.user.findUnique({
      where: { discordId: discordUserId },
      include: {
        characters: {
          include: {
            realm: true,
            region: true,
            sect: true,
          },
        },
      },
    });

    if (!user || user.characters.length === 0) {
      return interaction.reply({
        content: "Ngươi chưa có nhân vật.",
        flags: MessageFlags.Ephemeral,
      });
    }

    const character = user.characters[0]!;
    if (character.id !== targetId) {
      return interaction.reply({
        content: "Đây không phải nhân vật của ngươi.",
        flags: MessageFlags.Ephemeral,
      });
    }

    // Acknowledge immediately
    await interaction.deferReply({ ephemeral: true });

    try {
      // Check prerequisites
      canCultivate(character as never, subAction.toUpperCase() as never);

      // Resolve cultivation
      const result = resolveCultivation(
        character as never,
        subAction.toUpperCase() as never,
        character.sectId,
      );

      // Update character in database
      const modeNames: Record<string, string> = {
        STABLE: "Ổn Định Căn Cơ",
        FORCED: "Cưỡng Ép Tu Luyện",
        SECLUSION: "Bế Quan 8 Giờ",
        SECT: "Tu Luyện Tông Môn",
      };

      const modeName = modeNames[subAction.toUpperCase()] ?? subAction;

      // Update DB
      await container.db.$transaction(async (tx) => {
        await tx.character.update({
          where: { id: character.id },
          data: {
            cultivationPoints: { increment: result.pointsGained },
            heartDemon: { increment: result.heartDemonGained },
            lastCultivationAt: new Date(),
          },
        });

        if (result.injury > 0) {
          await tx.injury.create({
            data: {
              characterId: character.id,
              level: result.injury,
              type: "NỘI THƯƠNG",
              source: subAction,
              expiresAt: new Date(Date.now() + result.injury * 3 * 86_400_000),
            },
          });
        }

        if (result.spiritStonesGained > 0) {
          await tx.character.update({
            where: { id: character.id },
            data: { spiritStones: { increment: result.spiritStonesGained } },
          });
        }

        // Log
        await tx.cultivationSession.create({
          data: {
            characterId: character.id,
            mode: subAction.toUpperCase(),
            pointsGained: result.pointsGained,
            heartDemon: result.heartDemonGained,
            injury: result.injury,
            spiritStones: result.spiritStonesGained,
            stability: result.stability,
          },
        });

        await tx.actionLog.create({
          data: {
            characterId: character.id,
            action: "CULTIVATE",
            details: {
              mode: subAction.toUpperCase(),
              points: result.pointsGained,
              heartDemon: result.heartDemonGained,
              injury: result.injury,
              stability: result.stability,
            },
            publicLog: result.shouldPublicLog,
          },
        });
      });

      // Build response embed
      const realmDef = character.realm;
      const totalPoints = realmDef.pointsPerSubStage * 3;
      const newProgress = Math.round(
        ((character.cultivationPoints + result.pointsGained) / totalPoints) * 100,
      );
      const progressBar =
        "█".repeat(Math.floor(newProgress / 10)) +
        "░".repeat(10 - Math.floor(newProgress / 10));

      const embed = new EmbedBuilder()
        .setTitle("✨ KẾT QUẢ TU LUYỆN")
        .setColor(EmbedColors.CULTIVATION)
        .addFields(
          {
            name: "Phương thức",
            value: modeName,
            inline: true,
          },
          {
            name: "Tu vi",
            value: `+${result.pointsGained.toLocaleString()}`,
            inline: true,
          },
          {
            name: "Tâm ma",
            value: `+${result.heartDemonGained}`,
            inline: true,
          },
          {
            name: "Tiến độ",
            value: `${progressBar} ${newProgress}%\n` +
              `\`${(character.cultivationPoints + result.pointsGained).toLocaleString()} / ${totalPoints.toLocaleString()}\``,
            inline: false,
          },
        );

      if (result.injury > 0) {
        embed.addFields({
          name: "⚠️ Nội Thương",
          value: `Ngươi đã bị thương cấp ${result.injury}!`,
          inline: false,
        });
      }

      if (result.spiritStonesGained > 0) {
        embed.addFields({
          name: "💎 Linh Thạch",
          value: `+${result.spiritStonesGained} ST`,
          inline: false,
        });
      }

      embed.setFooter({ text: `Độ ổn định: ${result.stability}/100` });

      return interaction.editReply({ embeds: [embed], components: [] });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Có lỗi xảy ra";
      return interaction.editReply({
        content: `❌ ${message}`,
        components: [],
      });
    }
  }
}
