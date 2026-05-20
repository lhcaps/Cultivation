/**
 * Character REST controller.
 */
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { type CharacterService } from './character.service.js'
import {
  DiscordUserIdSchema,
  StartCharacterRequestSchema,
  type StartCharacterRequest,
} from './character.schemas.js'

@ApiTags('characters')
@Controller('characters')
export class CharacterController {
  public constructor(private readonly characterService: CharacterService) {}

  @Post('start')
  @ApiOperation({ summary: 'Create the first character for a Discord user' })
  @ApiResponse({ status: 201, description: 'Character created or existing character returned' })
  async start(@Body() body: StartCharacterRequest) {
    const parsed = StartCharacterRequestSchema.safeParse(body)
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten())
    }

    return this.characterService.createForDiscordUser(parsed.data)
  }

  @Get('discord/:discordId/profile')
  @ApiOperation({ summary: 'Get the active character profile for a Discord user' })
  @ApiResponse({ status: 200, description: 'Character profile found' })
  @ApiResponse({ status: 404, description: 'Character not found' })
  async getProfileByDiscordId(@Param('discordId') discordId: string) {
    const parsed = DiscordUserIdSchema.safeParse(discordId)
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten())
    }

    const profile = await this.characterService.getProfileByDiscordId(parsed.data)
    if (!profile) {
      throw new NotFoundException('Character not found')
    }

    return profile
  }

  @Get('leaderboard/top')
  @ApiOperation({ summary: 'Get cultivation leaderboard' })
  async getLeaderboard() {
    return this.characterService.getLeaderboard(10)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get character by ID' })
  @ApiResponse({ status: 200, description: 'Character found' })
  @ApiResponse({ status: 404, description: 'Character not found' })
  async getById(@Param('id') id: string) {
    const character = await this.characterService.findById(id)
    if (!character) {
      throw new NotFoundException('Character not found')
    }
    return character
  }
}
