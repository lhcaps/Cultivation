/**
 * Cultivate command — main cultivation mini-game.
 */
import { Command } from "@sapphire/framework";
import {
  type ChatInputCommandInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import { EmbedColors } from "../utils/interaction.js";
import { buildCustomId } from "../utils/interaction.js";

export class CultivateCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: "cultivate",
      description: "Tu luyện để tăng tu vi",
    });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName("cultivate")
        .setDescription("Tu luyện để tăng tu vi"),
    );
  }

  public async chatInputRun(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const discordUserId = interaction.user.id;

    // Find character
    const user = await this.container.db.user.findUnique({
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
      return interaction.editReply({
        content: "Ngươi chưa có nhân vật. Dùng **/start** trước.",
      });
    }

    const character = user.characters[0]!;
    const realmDef = character.realm;
    const totalPoints = realmDef.pointsPerSubStage * 3;
    const progress = Math.round((character.cultivationPoints / totalPoints) * 100);
    const progressBar = "█".repeat(Math.floor(progress / 10)) + "░".repeat(10 - Math.floor(progress / 10));

    // Check cooldown
    if (character.lastCultivationAt) {
      const hoursSince = (Date.now() - character.lastCultivationAt.getTime()) / 3_600_000;
      if (hoursSince < 1) {
        const remaining = (1 - hoursSince).toFixed(1);
        return interaction.editReply({
          content: `⏳ Cooldown còn **${remaining} giờ**. Hãy nghỉ ngơi một chút.`,
        });
      }
    }

    const embed = new EmbedBuilder()
      .setTitle("🧘 TU LUYỆN")
      .setColor(EmbedColors.CULTIVATION)
      .setDescription(
        `**${character.name}** — ${realmDef.name} (${character.subStage} kỳ)\n` +
          `Tu vi: ${progressBar} ${progress}%\n` +
          `\`${character.cultivationPoints.toLocaleString()} / ${totalPoints.toLocaleString()}\`\n\n` +
          `📍 **${character.region.name}** | 🩸 Tâm ma: ${character.heartDemon}/100\n` +
          `${character.sect ? `🏛️ **${character.sect.name}**` : ""}`,
      )
      .setFooter({ text: "Chọn phương thức tu luyện bên dưới" });

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(buildCustomId("cultivate", "stable", character.id))
        .setLabel("Ổn Định Căn Cơ")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("🛡️"),
      new ButtonBuilder()
        .setCustomId(buildCustomId("cultivate", "forced", character.id))
        .setLabel("Cưỡng Ép Tu Luyện")
        .setStyle(ButtonStyle.Danger)
        .setEmoji("⚡"),
      new ButtonBuilder()
        .setCustomId(buildCustomId("cultivate", "seclusion", character.id))
        .setLabel("Bế Quan 8 Giờ")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("🏯"),
      new ButtonBuilder()
        .setCustomId(buildCustomId("cultivate", "sect", character.id))
        .setStyle(ButtonStyle.Success)
        .setLabel("Tu Luyện Tông Môn")
        .setEmoji("🏛️")
        .setDisabled(!character.sectId),
    );

    return interaction.editReply({ embeds: [embed], components: [row] });
  }
}
