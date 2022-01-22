import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {
  FilterQuery,
  Model,
  QueryOptions,
  UpdateQuery,
  UpdateWithAggregationPipeline,
} from "mongoose";
import { from, map, mapTo, mergeMap, Observable, tap } from "rxjs";
import { Game, GameDocument, GAME_NAME_SCHEMA } from "../schemas/game.schemas";
import { Player } from "../schemas/player.schemas";

@Injectable()
export class GameRepository {
  constructor(
    @InjectModel(GAME_NAME_SCHEMA) private gameModel: Model<GameDocument>
  ) {}

  save(creatorId: string): Observable<Game> {
    const createdCat = new this.gameModel({ creatorId });
    return from(createdCat.save()).pipe(
      map((gameDocument) => gameDocument.toJSON())
    );
  }

  findById(
    id: string,
    projection?: any | null,
    options?: QueryOptions | null
  ): Observable<Game> {
    return from(this.gameModel.findById(id, projection, options)).pipe(
      map((gameDocument) => gameDocument.toJSON())
    );
  }

  // TODO: fix any
  updateOne(
    filter?: FilterQuery<Game>,
    update?: UpdateQuery<Game> | UpdateWithAggregationPipeline,
    options?: QueryOptions | null
  ): Observable<any> {
    return from(this.gameModel.updateOne(filter, update, options)).pipe(
      tap((gameDocument) => console.log("updateOne", { gameDocument }))
    );
  }

  findOneAndUpdate(
    filter?: FilterQuery<Game>,
    update?: UpdateQuery<Game>,
    options?: QueryOptions | null
  ): Observable<Game | null> {
    return from(this.gameModel.findOneAndUpdate(filter, update, options)).pipe(
      map((gameDocument) => {
        if (!!gameDocument && !!gameDocument.toJSON) {
          return gameDocument.toJSON();
        }
        return null;
      })
    );
  }

  // TODO: fix any
  find(): Observable<any> {
    return from(this.gameModel.find()).pipe(
      tap((gameDocument) => console.log("find", { gameDocument }))
    );
  }
}
