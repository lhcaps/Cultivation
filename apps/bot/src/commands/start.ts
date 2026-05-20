/**
 * Start command - create a new character through the API.
 */
import { Command } from '@sapphire/framework'
import { type ChatInputCommandInteraction } from 'discord.js'
import { apiClient } from '../api/client.js'

export class StartCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'start',
      description: 'Bat dau hanh trinh tu tien',
      preconditions: [],
    })
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName('start')
        .setDescription('Bat dau hanh trinh tu tien')
        .addStringOption((option) =>
          option
            .setName('name')
            .setDescription('Ten nhan vat (2-4 ky tu)')
            .setMinLength(2)
            .setMaxLength(4)
            .setRequired(true),
        ),
    )
  }

  public override async chatInputRun(interaction: ChatInputCommandInteraction) {
    const name = interaction.options.getString('name', true)
    const discordUserId = interaction.user.id

    await interaction.deferReply({ ephemeral: true })

    if (name.trim().length < 2 || name.trim().length > 4) {
      return interaction.editReply({
        content: 'Ten nhan vat phai tu 2-4 ky tu.',
      })
    }

    try {
      const result = await apiClient.createCharacter({
        discordUserId,
        username: interaction.user.username,
        name,
      })

      if (!result.created) {
        return interaction.editReply({
          content:
            `Nguoi da co nhan vat roi. Dung /profile de xem thong tin.\n` +
            `Nhan vat hien tai: **${result.character.name}**`,
        })
      }

      return interaction.editReply({
        content:
          `Chao mung **${result.character.name}** den voi Thien Nam Vo Luc!\n\n` +
          `Nguoi bat dau tai **Luyen The so ky** voi:\n` +
          `- HP: ${result.character.maxHp}\n` +
          `- Qi: ${result.character.maxQi}\n` +
          `- Silver: ${result.character.silver}\n` +
          `- Cong phap: Thanh Van Quyet\n\n` +
          `Dung **/cultivate** de bat dau tu luyen, hoac **/help** de xem danh sach lenh.`,
      })
    } catch (error) {
      this.container.logger.error('Character creation failed:', error)
      return interaction.editReply({
        content: 'Co loi xay ra khi tao nhan vat. Vui long thu lai sau.',
      })
    }
  }
}
