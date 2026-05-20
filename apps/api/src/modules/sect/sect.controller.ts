/**
 * Sect REST controller.
 */
import { BadRequestException, Body, Controller, Get, Inject, Param, Post } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { SectService } from './sect.service.js'
import { SectMembershipRequestSchema, type SectMembershipRequest } from './sect.schemas.js'

@ApiTags('sects')
@Controller('sects')
export class SectController {
  public constructor(@Inject(SectService) private readonly sectService: SectService) {}

  @Get()
  @ApiOperation({ summary: 'List all sects' })
  async findAll() {
    return this.sectService.findAll()
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get sect treasury leaderboard' })
  async getLeaderboard() {
    return this.sectService.getLeaderboard(10)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get sect by ID' })
  async findById(@Param('id') id: string) {
    return this.sectService.findById(id)
  }

  @Post(':id/join')
  @ApiOperation({ summary: 'Join a sect' })
  async joinSect(@Param('id') id: string, @Body() body: SectMembershipRequest) {
    const parsed = SectMembershipRequestSchema.safeParse(body)
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten())
    }

    return this.sectService.joinSect(parsed.data.characterId, id)
  }

  @Post(':id/leave')
  @ApiOperation({ summary: 'Leave a sect' })
  async leaveSect(@Param('id') _id: string, @Body() body: SectMembershipRequest) {
    const parsed = SectMembershipRequestSchema.safeParse(body)
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten())
    }

    return this.sectService.leaveSect(parsed.data.characterId)
  }
}
