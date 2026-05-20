/**
 * Interaction handlers - button clicks for cultivation.
 */
import { Listener } from '@sapphire/framework'
import { type ButtonInteraction, EmbedBuilder } from 'discord.js'
import { apiClient, type CultivationMode } from '../api/client.js'
import { EmbedColors, parseCustomId } from '../utils/interaction.js'

const cultivationModes = new Set<CultivationMode>(['STABLE', 'FORCED', 'SECLUSION', 'SECT'])

export class ButtonInteractionListener extends Listener {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
      event: 'interactionCreate',
    })
  }

  public override async run(interaction: ButtonInteraction) {
    if (!interaction.isButton()) return
    if (!interaction.customId.startsWith('cultivate:')) return

    await interaction.deferReply({ ephemeral: true })

    const customId = parseCustomId(interaction.customId)
    if (!customId) {
      return interaction.editReply({ content: 'Custom ID khong hop le.' })
    }

    const rawMode = customId.subAction.toUpperCase()
    if (!cultivationModes.has(rawMode as CultivationMode)) {
      return interaction.editReply({ content: 'Che do khong hop le.' })
    }

    const mode = rawMode as CultivationMode

    try {
      const result = await apiClient.cultivate({
        discordUserId: interaction.user.id,
        characterId: customId.targetId,
        mode,
      })

      const newCultivationPoints = result.previousCultivationPoints + result.pointsGained
      const newProgress = clampProgress(
        Math.round((newCultivationPoints / result.totalPoints) * 100),
      )
      const progressBar =
        '#'.repeat(Math.floor(newProgress / 10)) + '-'.repeat(10 - Math.floor(newProgress / 10))

      const modeNames: Record<CultivationMode, string> = {
        STABLE: 'On dinh',
        FORCED: 'Cuong ep',
        SECLUSION: 'Be quan',
        SECT: 'Tong mon',
      }

      const embed = new EmbedBuilder()
        .setTitle('Ket qua tu luyen')
        .setColor(EmbedColors.CULTIVATION)
        .addFields(
          { name: 'Che do', value: modeNames[mode], inline: true },
          { name: 'Tu vi', value: `+${result.pointsGained.toLocaleString()}`, inline: true },
          { name: 'Tam ma', value: `+${result.heartDemonGained}`, inline: true },
          {
            name: 'Tien do',
            value:
              `${progressBar} ${newProgress}%\n` +
              `${newCultivationPoints.toLocaleString()} / ${result.totalPoints.toLocaleString()}`,
            inline: false,
          },
        )

      if (result.injury > 0) {
        embed.addFields({
          name: 'Chu y',
          value: `Ban bi thuong cap ${result.injury}!`,
          inline: false,
        })
      }

      if (result.spiritStonesGained > 0) {
        embed.addFields({
          name: 'Linh thach',
          value: `+${result.spiritStonesGained} ST`,
          inline: false,
        })
      }

      if (result.shouldPublicLog && result.publicLogMessage) {
        embed.setDescription(result.publicLogMessage)
      }

      embed.setFooter({ text: `Do on dinh: ${result.stability}/100` })

      return interaction.editReply({ embeds: [embed], components: [] })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Co loi xay ra'
      return interaction.editReply({ content: `Loi: ${message}`, components: [] })
    }
  }
}

function clampProgress(progress: number): number {
  return Math.min(100, Math.max(0, progress))
}
