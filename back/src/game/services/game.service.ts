import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { from, map, Observable } from "rxjs";
import { Game, GameDocument, GAME_NAME_SCHEMA } from "../schemas/game.schemas";

export interface FormattedGame {
  id: string;
  creatorId: string;
  players: { uuid: string; nickname: string }[];
}

@Injectable()
export class GameService {
  constructor(
    @InjectModel(GAME_NAME_SCHEMA) private gameModel: Model<GameDocument>
  ) {}

  create(creatorId: string): Observable<FormattedGame> {
    const createdCat = new this.gameModel({ creatorId });
    return from(createdCat.save()).pipe(
      map((mongoGame) => this.formatGame(mongoGame))
    );
  }

  findOne(gameId: string): Observable<FormattedGame> {
    return from(this.gameModel.findById(gameId).exec()).pipe(
      map((mongoGame: GameDocument) => this.formatGame(mongoGame))
    );
  }

  findAll(): Observable<Game[]> {
    return from(this.gameModel.find().exec());
  }

  private formatGame(rawGame: GameDocument): FormattedGame {
    return {
      id: rawGame._id,
      creatorId: rawGame.creatorId,
      players: rawGame.players,
    };
  }
}
