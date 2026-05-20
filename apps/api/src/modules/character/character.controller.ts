/**
 * Character REST controller.
 */
import { Controller, Get, Param, NotFoundException } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { type CharacterService } from "./character.service.js";

@ApiTags("characters")
@Controller("characters")
export class CharacterController {
  public constructor(private readonly characterService: CharacterService) {}

  @Get(":id")
  @ApiOperation({ summary: "Get character by ID" })
  @ApiResponse({ status: 200, description: "Character found" })
  @ApiResponse({ status: 404, description: "Character not found" })
  async getById(@Param("id") id: string) {
    const character = await this.characterService.findById(id);
    if (!character) {
      throw new NotFoundException("Character not found");
    }
    return character;
  }

  @Get("leaderboard/top")
  @ApiOperation({ summary: "Get cultivation leaderboard" })
  async getLeaderboard() {
    return this.characterService.getLeaderboard(10);
  }
}
