/**
 * Profile command — view character stats (ephemeral).
 */
import { Command } from "@sapphire/framework";
import { type ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { EmbedColors } from "../utils/interaction.js";

export class ProfileCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: "profile",
      description: "Xem thông tin nhân vật của bạn",
    });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName("profile")
        .setDescription("Xem thông tin nhân vật của bạn"),
    );
  }

  public async chatInputRun(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const discordUserId = interaction.user.id;

    const user = await this.container.db.user.findUnique({
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
    const progressBar = "█".repeat(Math.floor(progress / 10)) + "░".repeat(10 - Math.floor(progress / 10));

    const embed = new EmbedBuilder()
      .setTitle(`📜 ${character.name}`)
      .setColor(EmbedColors.INFO)
      .addFields(
        {
          name: "Cảnh giới",
          value: `**${realmDef.name}** (${character.subStage} kỳ)\n` +
            `${progressBar} ${progress}%\n` +
            `${character.cultivationPoints.toLocaleString()} / ${totalPoints.toLocaleString()} tu vi`,
          inline: true,
        },
        {
          name: "Trạng thái",
          value:
            `HP: ${character.currentHp}/${character.maxHp}\n` +
            `Qi: ${character.currentQi}/${character.maxQi}\n` +
            `Căn cơ: ${character.foundationQuality}/100`,
          inline: true,
        },
        {
          name: "Tâm ma & Thương thương",
          value: `Tâm ma: ${character.heartDemon}/100\nThương thương: Cấp ${character.injuryLevel}`,
          inline: false,
        },
        {
          name: "Tài nguyên",
          value:
            `Bạc: ${character.silver.toLocaleString()} Ag\n` +
            `Linh Thạch: ${character.spiritStones.toLocaleString()} ST\n` +
            `Công Huân: ${character.merit.toLocaleString()} Mer\n` +
            `Danh Vọng: ${character.reputation.toLocaleString()} Rep`,
          inline: true,
        },
        {
          name: "Vị trí",
          value:
            `Vùng: ${character.region.name}\n` +
            `Tông môn: ${character.sect?.name ?? "Vô tông"}\n` +
            `Công pháp: ${character.manual?.name ?? "Không có"}`,
          inline: true,
        },
      )
      .setFooter({ text: "Thiên Nam Võ Lục" })
      .setTimestamp();

    return interaction.editReply({ embeds: [embed] });
  }
}
