import { Body, Controller, Get, Param, Put } from "@nestjs/common";
import { Observable } from "rxjs";

import { FormattedGame, GameService } from "../services/game.service";

export class CreateGameBody {
  creatorId: string;
}

@Controller("games")
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Put()
  createGame(@Body() body: CreateGameBody): Observable<FormattedGame> {
    return this.gameService.create(body.creatorId);
  }

  @Get("/:gameId")
  findOneGame(@Param("gameId") gameId: string): Observable<FormattedGame> {
    return this.gameService.findOne(gameId);
  }
}
