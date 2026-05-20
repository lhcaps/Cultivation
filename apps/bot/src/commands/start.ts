/**
 * Start command — create a new character.
 */
import { Command } from "@sapphire/framework";
import { type ChatInputCommandInteraction } from "discord.js";
import { prisma } from "@thien-nam/db";

export class StartCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: "start",
      description: "Bat dau hanh trinh tu tien",
      preconditions: [],
    });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName("start")
        .setDescription("Bat dau hanh trinh tu tien")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("Ten nhan vat (2-4 ky tu)")
            .setMinLength(2)
            .setMaxLength(4)
            .setRequired(true),
        ),
    );
  }

  public override async chatInputRun(interaction: ChatInputCommandInteraction) {
    const name = interaction.options.getString("name", true);
    const discordUserId = interaction.user.id;

    await interaction.deferReply({ ephemeral: true });

    if (name.length < 2 || name.length > 4) {
      return interaction.editReply({
        content: "Tên nhân vật phải từ 2-4 ký tự.",
      });
    }

    const maxHp = 100;
    const maxQi = 50;

    try {
      await prisma.$transaction(async (tx) => {
        const existingCharacter = await tx.character.findFirst({
          where: { user: { discordId: discordUserId } },
          select: { id: true, name: true },
        });

        if (existingCharacter) {
          throw Object.assign(new Error("CHARACTER_EXISTS"), {
            existingName: existingCharacter.name,
          });
        }

        const user = await tx.user.upsert({
          where: { discordId: discordUserId },
          update: {},
          create: {
            discordId: discordUserId,
            username: interaction.user.username,
          },
        });

        const character = await tx.character.create({
          data: {
            userId: user.id,
            name,
            realmId: "LUYEN_THE",
            subStage: "SO",
            cultivationPoints: 0,
            maxHp,
            maxQi,
            currentHp: maxHp,
            currentQi: maxQi,
            manualId: "THANH_VAN_QUYET",
          },
        });

        await tx.actionLog.create({
          data: {
            characterId: character.id,
            action: "CHARACTER_CREATED",
            details: { name },
            publicLog: false,
          },
        });

        void user;
      });

      return interaction.editReply({
        content:
          `Chao mung **${name}** den voi Thien Nam Vo Luc!\n\n` +
          `Ngươi bắt đầu tại **Luyen The so ky** voi:\n` +
          `• HP: ${maxHp}\n` +
          `• Qi: ${maxQi}\n` +
          `• Silver: 500\n` +
          `• Cong phap: Thanh Van Quyet\n\n` +
          `Dung **/cultivate** de bat dau tu luyen, hoac **/help** de xem danh sach lenh.`,
      });
    } catch (error) {
      if (error instanceof Error && error.message === "CHARACTER_EXISTS") {
        const existingName = (error as typeof error & { existingName?: string }).existingName;
        return interaction.editReply({
          content: `Ngươi đã có nhân vật rồi. Dùng /profile để xem thông tin.\nNhân vật hiện tại: **${existingName ?? "?"}**`,
        });
      }
      this.container.logger.error("Character creation failed:", error);
      return interaction.editReply({
        content: "Có lỗi xảy ra khi tạo nhân vật. Vui lòng thử lại sau.",
      });
    }
  }
}
