/**
 * Profile command - view character stats through the API.
 */
import { Command } from '@sapphire/framework'
import { type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js'
import { apiClient } from '../api/client.js'
import { EmbedColors } from '../utils/interaction.js'

export class ProfileCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'profile',
      description: 'Xem thong tin nhan vat',
    })
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('profile').setDescription('Xem thong tin nhan vat'),
    )
  }

  public override async chatInputRun(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true })

    try {
      const profile = await apiClient.getProfile(interaction.user.id)
      if (!profile) {
        return interaction.editReply({
          content: 'Nguoi chua co nhan vat. Dung **/start** de tao nhan vat.',
        })
      }

      const progress = clampProgress(profile.progress)
      const progressBar =
        '='.repeat(Math.floor(progress / 10)) + '-'.repeat(10 - Math.floor(progress / 10))

      const embed = new EmbedBuilder()
        .setTitle(`${profile.name}`)
        .setColor(EmbedColors.INFO)
        .addFields(
          {
            name: 'Canh gioi',
            value:
              `${profile.realm.name} (${profile.subStage} ky)\n` +
              `${progressBar} ${progress}%\n` +
              `${profile.cultivationPoints.toLocaleString()} / ${profile.totalPoints.toLocaleString()} tu vi`,
            inline: true,
          },
          {
            name: 'Trang thai',
            value:
              `HP: ${profile.currentHp}/${profile.maxHp}\n` +
              `Qi: ${profile.currentQi}/${profile.maxQi}\n` +
              `Can co: ${profile.foundationQuality}/100`,
            inline: true,
          },
          {
            name: 'Tam ma',
            value: `Tam ma: ${profile.heartDemon}/100\nThuong the: Cap ${profile.injuryLevel}`,
            inline: false,
          },
          {
            name: 'Tai nguyen',
            value:
              `Bac: ${profile.silver.toLocaleString()} Ag\n` +
              `Linh Thach: ${profile.spiritStones.toLocaleString()} ST\n` +
              `Cong Huan: ${profile.merit.toLocaleString()} Mer\n` +
              `Danh Vong: ${profile.reputation.toLocaleString()} Rep`,
            inline: true,
          },
          {
            name: 'Vi tri',
            value:
              `Vung: ${profile.regionName}\n` +
              `Tong mon: ${profile.sectName ?? 'Vo tong'}\n` +
              `Cong phap: ${profile.manualName ?? 'Khong co'}`,
            inline: true,
          },
        )
        .setFooter({ text: 'Thien Nam Vo Luc' })
        .setTimestamp()

      return interaction.editReply({ embeds: [embed] })
    } catch (error) {
      this.container.logger.error('Profile lookup failed:', error)
      return interaction.editReply({
        content: 'Co loi xay ra khi lay ho so nhan vat. Vui long thu lai sau.',
      })
    }
  }
}

function clampProgress(progress: number): number {
  return Math.min(100, Math.max(0, progress))
}
