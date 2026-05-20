/**
 * Cultivate command - main cultivation menu.
 */
import { Command } from '@sapphire/framework'
import {
  type ChatInputCommandInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from 'discord.js'
import { apiClient, type CultivationMode } from '../api/client.js'
import { EmbedColors, buildCustomId } from '../utils/interaction.js'

const modeButtonStyles: Record<CultivationMode, ButtonStyle> = {
  STABLE: ButtonStyle.Secondary,
  FORCED: ButtonStyle.Danger,
  SECLUSION: ButtonStyle.Primary,
  SECT: ButtonStyle.Success,
}

const modeEmojis: Record<CultivationMode, string> = {
  STABLE: 'S',
  FORCED: '!',
  SECLUSION: 'B',
  SECT: 'T',
}

export class CultivateCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'cultivate',
      description: 'Tu luyen de tang tu vi',
    })
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('cultivate').setDescription('Tu luyen de tang tu vi'),
    )
  }

  public override async chatInputRun(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true })

    try {
      const menu = await apiClient.getCultivationMenu(interaction.user.id)
      if (!menu) {
        return interaction.editReply({
          content: 'Nguoi chua co nhan vat. Dung **/start** truoc.',
        })
      }

      const progress = clampProgress(menu.character.progress)
      const progressBar =
        '='.repeat(Math.floor(progress / 10)) + '-'.repeat(10 - Math.floor(progress / 10))

      const embed = new EmbedBuilder()
        .setTitle('TU LUYEN')
        .setColor(EmbedColors.CULTIVATION)
        .setDescription(
          `**${menu.character.name}** - ${menu.character.realmName} (${menu.character.subStage} ky)\n` +
            `Tu vi: ${progressBar} ${progress}%\n` +
            `\`${menu.character.cultivationPoints.toLocaleString()} / ${menu.character.totalPoints.toLocaleString()}\`\n\n` +
            `Vi tri: **${menu.character.regionName}** | Tam ma: ${menu.character.heartDemon}/100\n` +
            `${menu.character.sectName ? `Tong mon: **${menu.character.sectName}**` : ''}`,
        )
        .setFooter({ text: 'Chon phuong thuc tu luyen ben duoi' })

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        ...menu.modes.map((mode) =>
          new ButtonBuilder()
            .setCustomId(buildCustomId('cultivate', mode.mode.toLowerCase(), menu.character.id))
            .setLabel(mode.reason ? `${mode.label} (${mode.reason})` : mode.label)
            .setStyle(modeButtonStyles[mode.mode])
            .setEmoji(modeEmojis[mode.mode])
            .setDisabled(mode.disabled),
        ),
      )

      return interaction.editReply({ embeds: [embed], components: [row] })
    } catch (error) {
      this.container.logger.error('Cultivation menu failed:', error)
      return interaction.editReply({
        content: 'Co loi xay ra khi mo bang tu luyen. Vui long thu lai sau.',
      })
    }
  }
}

function clampProgress(progress: number): number {
  return Math.min(100, Math.max(0, progress))
}
