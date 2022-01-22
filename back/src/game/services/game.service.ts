import { GameRepository } from "./../repository/game.repository";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { from, map, mapTo, mergeMap, Observable, of, tap } from "rxjs";
import { Game, GameDocument, GAME_NAME_SCHEMA } from "../schemas/game.schemas";
import { Player } from "../schemas/player.schemas";

const TIME_BOMB_CONFIG: {
  [playerNumber: number]: {
    bombCardNumber: number;
    secureWireCardsNumber: number;
    defusingWireCardsNumber: number;
  };
} = {
  4: {
    bombCardNumber: 1,
    secureWireCardsNumber: 15,
    defusingWireCardsNumber: 4,
  },
  5: {
    bombCardNumber: 1,
    secureWireCardsNumber: 19,
    defusingWireCardsNumber: 5,
  },
  6: {
    bombCardNumber: 1,
    secureWireCardsNumber: 23,
    defusingWireCardsNumber: 6,
  },
  7: {
    bombCardNumber: 1,
    secureWireCardsNumber: 27,
    defusingWireCardsNumber: 7,
  },
  8: {
    bombCardNumber: 1,
    secureWireCardsNumber: 31,
    defusingWireCardsNumber: 8,
  },
};

@Injectable()
export class GameService {
  constructor(
    @InjectModel(GAME_NAME_SCHEMA) private gameModel: Model<GameDocument>,
    private readonly gameRepository: GameRepository
  ) {}

  create(creatorId: string): Observable<Game> {
    return this.gameRepository.save(creatorId);
  }

  // tojson pour enlever les propriété mongo
  findOne(gameId: string): Observable<Game> {
    return this.gameRepository.findById(gameId);
  }

  startGame(gameId: string): Observable<null> {
    return this.findOne(gameId).pipe(
      map((game) => {
        const turn = 1;
        const cardsPerPLayer = 6 - turn;

        if (turn < 5) {
          const players = [...game.players];
          const randomPlayerIndex = Math.floor(
            Math.random() * game.players.length
          );

          let cardsNumberToDeal = game.players.length * cardsPerPLayer;
          let cardsNumberToDealTotal = cardsNumberToDeal;

          const {
            bombCardNumber,
            secureWireCardsNumber,
            defusingWireCardsNumber,
          } = TIME_BOMB_CONFIG[game.players.length];

          while (cardsNumberToDeal > 0) {
            players[
              randomPlayerIndex +
                ((cardsNumberToDealTotal - cardsNumberToDeal) %
                  game.players.length)
            ];
            cardsNumberToDeal--;
          }
        }
      }),
      mergeMap((game) =>
        from(
          this.gameModel
            .updateOne(
              { _id: gameId },
              {
                started: true,
                // ...TB_CONFIG[game.players.length],
              }
            )
            .exec()
        )
      ),
      mapTo(null)
    );
  }

  joinGame(gameId: string, player: Player): Observable<Game> {
    return this.gameRepository
      .findOneAndUpdate(
        { _id: gameId, "players.id": { $ne: player.id } },
        {
          $addToSet: {
            players: { id: player.id, nickname: player.nickname },
          },
        },
        { new: true }
      )
      .pipe(
        mergeMap((game) =>
          !!game ? of(game) : this.gameRepository.findById(gameId)
        )
      );
  }

  leaveGame(gameId: string, playerId: string): Observable<Game> {
    return this.gameRepository
      .findOneAndUpdate(
        { _id: gameId, "players.id": playerId },
        {
          $pull: { players: { id: playerId } },
        },
        { new: true }
      )
      .pipe(
        mergeMap((game) =>
          !!game ? of(game) : this.gameRepository.findById(gameId)
        )
      );
  }

  findAll(): Observable<Game[]> {
    return this.gameRepository.find();
  }
}
