/**
 * Start command — create a new character.
 */
import { Command } from "@sapphire/framework";
import { type ChatInputCommandInteraction } from "discord.js";

export class StartCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: "start",
      description: "Bắt đầu hành trình tu tiên của bạn",
      preconditions: [],
    });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName("start")
        .setDescription("Bắt đầu hành trình tu tiên của bạn")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("Tên nhân vật (2-4 ký tự)")
            .setMinLength(2)
            .setMaxLength(4)
            .setRequired(true),
        ),
    );
  }

  public async chatInputRun(interaction: ChatInputCommandInteraction) {
    const name = interaction.options.getString("name", true);
    const discordUserId = interaction.user.id;

    // Defer reply immediately
    await interaction.deferReply({ ephemeral: true });

    // Check if user already has a character
    const existingUser = await this.container.db.user.findUnique({
      where: { discordId: discordUserId },
      include: { characters: true },
    });

    if (existingUser && existingUser.characters.length > 0) {
      return interaction.editReply({
        content: `Ngươi đã có nhân vật rồi. Dùng /profile để xem thông tin.\nNhân vật hiện tại: **${existingUser.characters[0]!.name}** (${existingUser.characters[0]!.realmId})`,
      });
    }

    // Validate name (simple check)
    if (!/^[\p{L}\s]+$/u.test(name) || name.length < 2 || name.length > 4) {
      return interaction.editReply({
        content: "Tên nhân vật phải từ 2-4 ký tự chữ cái.",
      });
    }

    // Get starting realm
    const startingRealm = await this.container.db.realm.findUnique({
      where: { id: "LUYEN_THE" },
    });

    if (!startingRealm) {
      return interaction.editReply({
        content: "Lỗi hệ thống: Không tìm thấy cảnh giới khởi tạo.",
      });
    }

    // Calculate starting stats
    const maxHp = 100;
    const maxQi = 50;

    // Create user and character in transaction
    try {
      const result = await this.container.db.$transaction(async (tx) => {
        // Create or find user
        const user = await tx.user.upsert({
          where: { discordId: discordUserId },
          update: {},
          create: {
            discordId: discordUserId,
            username: interaction.user.username,
          },
        });

        // Create character
        const character = await tx.character.create({
          data: {
            userId: user.id,
            name,
            realmId: "LUYEN_THE",
            subStage: "SƠ",
            cultivationPoints: 0,
            maxHp,
            maxQi,
            currentHp: maxHp,
            currentQi: maxQi,
            manualId: "THANH_VAN_QUYET",
          },
        });

        return { user, character };
      });

      // Log action
      await this.container.db.actionLog.create({
        data: {
          characterId: result.character.id,
          action: "CHARACTER_CREATED",
          details: { name },
          publicLog: false,
        },
      });

      return interaction.editReply({
        content:
          `Chào mừng **${name}** đến với Thiên Nam Võ Lục!\n\n` +
          `Ngươi bắt đầu tại **Luyện Thể sơ kỳ** với:\n` +
          `• HP: ${maxHp}\n` +
          `• Qi: ${maxQi}\n` +
          `• Silver: 500\n` +
          `• Công pháp: Thanh Vân Quyết\n\n` +
          `Dùng **/cultivate** để bắt đầu tu luyện, hoặc **/help** để xem danh sách lệnh.`,
      });
    } catch (error) {
      this.container.logger.error("Character creation failed:", error);
      return interaction.editReply({
        content: "Có lỗi xảy ra khi tạo nhân vật. Vui lòng thử lại sau.",
      });
    }
  }
}
