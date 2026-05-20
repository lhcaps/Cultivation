/**
 * Cultivation REST controller.
 */
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { CultivationService } from './cultivation.service.js'
import { DiscordUserIdSchema } from '../character/character.schemas.js'
import { CultivateRequestSchema, type CultivateRequest } from './cultivation.schemas.js'

@ApiTags('cultivation')
@Controller('cultivation')
export class CultivationController {
  public constructor(
    @Inject(CultivationService) private readonly cultivationService: CultivationService,
  ) {}

  @Get('discord/:discordId/menu')
  @ApiOperation({ summary: 'Get cultivation menu data for a Discord user' })
  @ApiResponse({ status: 200, description: 'Cultivation menu found' })
  @ApiResponse({ status: 404, description: 'Character not found' })
  async getMenuForDiscordUser(@Param('discordId') discordId: string) {
    const parsedDiscordId = DiscordUserIdSchema.safeParse(discordId)
    if (!parsedDiscordId.success) {
      throw new BadRequestException(parsedDiscordId.error.flatten())
    }

    const menu = await this.cultivationService.getMenuForDiscordUser(parsedDiscordId.data)
    if (!menu) {
      throw new NotFoundException('Character not found')
    }

    return menu
  }

  @Post('discord/:discordId/:characterId')
  @ApiOperation({ summary: 'Cultivate a character owned by a Discord user' })
  @ApiResponse({ status: 200, description: 'Cultivation successful' })
  @ApiResponse({ status: 400, description: 'Cannot cultivate' })
  async cultivateForDiscordUser(
    @Param('discordId') discordId: string,
    @Param('characterId') characterId: string,
    @Body() body: CultivateRequest,
  ) {
    const parsedDiscordId = DiscordUserIdSchema.safeParse(discordId)
    if (!parsedDiscordId.success) {
      throw new BadRequestException(parsedDiscordId.error.flatten())
    }

    const parsedBody = CultivateRequestSchema.safeParse(body)
    if (!parsedBody.success) {
      throw new BadRequestException(parsedBody.error.flatten())
    }

    return this.cultivationService.cultivateForDiscordUser(
      parsedDiscordId.data,
      characterId,
      parsedBody.data.mode,
    )
  }

  @Post(':characterId')
  @ApiOperation({ summary: 'Cultivate a character' })
  @ApiResponse({ status: 200, description: 'Cultivation successful' })
  @ApiResponse({ status: 400, description: 'Cannot cultivate' })
  async cultivate(@Param('characterId') characterId: string, @Body() body: CultivateRequest) {
    const parsed = CultivateRequestSchema.safeParse(body)
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten())
    }
    return this.cultivationService.cultivate(characterId, parsed.data.mode)
  }
}
