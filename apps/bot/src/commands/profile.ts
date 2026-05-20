/**
 * Profile command — view character stats (ephemeral).
 */
import { Command } from "@sapphire/framework";
import { type ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { prisma } from "@thien-nam/db";
import { EmbedColors } from "../utils/interaction.js";

export class ProfileCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: "profile",
      description: "Xem thong tin nhan vat",
    });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName("profile")
        .setDescription("Xem thong tin nhan vat"),
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
            manual: true,
          },
        },
      },
    });

    if (!user || user.characters.length === 0) {
      return interaction.editReply({
        content: "Ngươi chưa có nhân vật. Dùng **/start** để tạo nhân vật.",
      });
    }

    const character = user.characters[0]!;
    const realmDef = character.realm;
    const totalPoints = realmDef.pointsPerSubStage * 3;
    const progress = Math.round((character.cultivationPoints / totalPoints) * 100);
    const progressBar = "=".repeat(Math.floor(progress / 10)) + "-".repeat(10 - Math.floor(progress / 10));

    const embed = new EmbedBuilder()
      .setTitle(`${character.name}`)
      .setColor(EmbedColors.INFO)
      .addFields(
        {
          name: "Canh giai",
          value: `${realmDef.name} (${character.subStage} ky)\n` +
            `${progressBar} ${progress}%\n` +
            `${character.cultivationPoints.toLocaleString()} / ${totalPoints.toLocaleString()} tu vi`,
          inline: true,
        },
        {
          name: "Trang thai",
          value:
            `HP: ${character.currentHp}/${character.maxHp}\n` +
            `Qi: ${character.currentQi}/${character.maxQi}\n` +
            `Can co: ${character.foundationQuality}/100`,
          inline: true,
        },
        {
          name: "Tam ma",
          value: `Tam ma: ${character.heartDemon}/100\nThuong thuong: Cap ${character.injuryLevel}`,
          inline: false,
        },
        {
          name: "Tai nguyen",
          value:
            `Bac: ${character.silver.toLocaleString()} Ag\n` +
            `Linh Thach: ${character.spiritStones.toLocaleString()} ST\n` +
            `Cong Huan: ${character.merit.toLocaleString()} Mer\n` +
            `Danh Vong: ${character.reputation.toLocaleString()} Rep`,
          inline: true,
        },
        {
          name: "Vi tri",
          value:
            `Vung: ${character.region.name}\n` +
            `Tong mon: ${character.sect?.name ?? "Vo tong"}\n` +
            `Cong phap: ${character.manual?.name ?? "Khong co"}`,
          inline: true,
        },
      )
      .setFooter({ text: "Thien Nam Vo Luc" })
      .setTimestamp();

    return interaction.editReply({ embeds: [embed] });
  }
}
