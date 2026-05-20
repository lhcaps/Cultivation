/**
 * Sect REST controller.
 */
import { Controller, Get, Post, Param, Body } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { SectService } from "./sect.service.js";

@ApiTags("sects")
@Controller("sects")
export class SectController {
  public constructor(private readonly sectService: SectService) {}

  @Get()
  @ApiOperation({ summary: "List all sects" })
  async findAll() {
    return this.sectService.findAll();
  }

  @Get("leaderboard")
  @ApiOperation({ summary: "Get sect treasury leaderboard" })
  async getLeaderboard() {
    return this.sectService.getLeaderboard(10);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get sect by ID" })
  async findById(@Param("id") id: string) {
    return this.sectService.findById(id);
  }

  @Post(":id/join")
  @ApiOperation({ summary: "Join a sect" })
  async joinSect(@Param("id") id: string, @Body() body: { characterId: string }) {
    return this.sectService.joinSect(body.characterId, id);
  }

  @Post(":id/leave")
  @ApiOperation({ summary: "Leave a sect" })
  async leaveSect(@Param("id") id: string, @Body() body: { characterId: string }) {
    return this.sectService.leaveSect(body.characterId);
  }
}
