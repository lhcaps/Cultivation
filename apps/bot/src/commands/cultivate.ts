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
import { prisma } from "@thien-nam/db";
import { EmbedColors, buildCustomId } from "../utils/interaction.js";

export class CultivateCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: "cultivate",
      description: "Tu luyen de tang tu vi",
    });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName("cultivate")
        .setDescription("Tu luyen de tang tu vi"),
    );
  }

  public override async chatInputRun(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const discordUserId = interaction.user.id;

    const user = await prisma.user.findUnique({
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
    const progressBar = "=".repeat(Math.floor(progress / 10)) + "-".repeat(10 - Math.floor(progress / 10));

    if (character.lastCultivationAt) {
      const hoursSince = (Date.now() - character.lastCultivationAt.getTime()) / 3_600_000;
      if (hoursSince < 1) {
        const remaining = (1 - hoursSince).toFixed(1);
        return interaction.editReply({
          content: `Cooldown con **${remaining} gio**. Hay nghi ngoi mot chut.`,
        });
      }
    }

    const embed = new EmbedBuilder()
      .setTitle("TU LUYEN")
      .setColor(EmbedColors.CULTIVATION)
      .setDescription(
        `**${character.name}** — ${realmDef.name} (${character.subStage} ky)\n` +
          `Tu vi: ${progressBar} ${progress}%\n` +
          `\`${character.cultivationPoints.toLocaleString()} / ${totalPoints.toLocaleString()}\`\n\n` +
          `Vi tri: **${character.region.name}** | Tam ma: ${character.heartDemon}/100\n` +
          `${character.sect ? `Tong mon: **${character.sect.name}**` : ""}`,
      )
      .setFooter({ text: "Chon phuong thuc tu luyen ben duoi" });

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(buildCustomId("cultivate", "stable", character.id))
        .setLabel("On dinh")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("S"),
      new ButtonBuilder()
        .setCustomId(buildCustomId("cultivate", "forced", character.id))
        .setLabel("Cuong ep")
        .setStyle(ButtonStyle.Danger)
        .setEmoji("!"),
      new ButtonBuilder()
        .setCustomId(buildCustomId("cultivate", "seclusion", character.id))
        .setLabel("Be quan 8 gio")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("B"),
      new ButtonBuilder()
        .setCustomId(buildCustomId("cultivate", "sect", character.id))
        .setStyle(ButtonStyle.Success)
        .setLabel("Tong mon")
        .setEmoji("T")
        .setDisabled(!character.sectId),
    );

    return interaction.editReply({ embeds: [embed], components: [row] });
  }
}
