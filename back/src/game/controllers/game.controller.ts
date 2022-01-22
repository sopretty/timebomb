import { Body, Controller, Get, Param, Put } from "@nestjs/common";
import { Observable } from "rxjs";

import { Game } from "../schemas/game.schemas";
import { GameService } from "../services/game.service";

export class CreateGameBody {
  creatorId: string;
}

@Controller("games")
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Put()
  createGame(@Body() body: CreateGameBody): Observable<Game> {
    return this.gameService.create(body.creatorId);
  }

  @Get("/:gameId")
  findOneGame(@Param("gameId") gameId: string): Observable<Game> {
    return this.gameService.findOne(gameId);
  }
}
