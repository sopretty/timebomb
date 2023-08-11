import { Model } from "mongoose";
import { map, mergeMap, Observable, of, tap } from "rxjs";
import { v4 as uuid } from "uuid";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import * as shuffle from "lodash.shuffle";
import { GameRepository } from "./../repository/game.repository";
import { Game, GameDocument, GAME_NAME_SCHEMA } from "../schemas/game.schemas";
import { Player } from "../schemas/player.schemas";
import { FormattedGame } from "./types";

const TIME_BOMB_CONFIG: {
  [playerNumber: number]: {
    bombCardNumber: number;
    secureWireCardsNumber: number;
    defusingWireCardsNumber: number;
    moriartyPlayerNumber: number;
    sherlockPlayerNumber: number;
  };
} = {
  4: {
    moriartyPlayerNumber: 2,
    sherlockPlayerNumber: 3,
    bombCardNumber: 1,
    secureWireCardsNumber: 15,
    defusingWireCardsNumber: 4,
  },
  5: {
    moriartyPlayerNumber: 2,
    sherlockPlayerNumber: 3,
    bombCardNumber: 1,
    secureWireCardsNumber: 19,
    defusingWireCardsNumber: 5,
  },
  6: {
    moriartyPlayerNumber: 2,
    sherlockPlayerNumber: 4,
    bombCardNumber: 1,
    secureWireCardsNumber: 23,
    defusingWireCardsNumber: 6,
  },
  7: {
    moriartyPlayerNumber: 3,
    sherlockPlayerNumber: 5,
    bombCardNumber: 1,
    secureWireCardsNumber: 27,
    defusingWireCardsNumber: 7,
  },
  8: {
    moriartyPlayerNumber: 3,
    sherlockPlayerNumber: 5,
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

  setup(gameId: string): Observable<Game> {
    return this.findOne(gameId).pipe(
      // game must be : started
      // players should have a role
      // if they come back they should get their role back
      map((game) => {
        // TODO: remove once tests are done `game.players.length`
        let players: Player[] = game.players.map((player) => ({
          ...player,
          turns: [],
        }));

        if (players.length === 1) {
          players = [
            ...game.players,
            ...game.players,
            ...game.players,
            ...game.players,
          ].map((player) => ({ ...player, turns: [] }));
        }

        const shuffledPlayers = shuffle(players).map((player, index) => ({
          ...player,
          index,
          ...(index === 0 ? { leader: true } : {}),
        }));

        const { sherlockPlayerNumber, moriartyPlayerNumber } =
          TIME_BOMB_CONFIG[shuffledPlayers.length];

        const rolePull = [
          ...Array.from(Array(sherlockPlayerNumber).keys()).map(
            (_ele, index) => ({
              role: "sherlock",
              index,
            })
          ),
          ...Array.from(Array(moriartyPlayerNumber).keys()).map(
            (_ele, index) => ({
              role: "moriarty",
              index,
            })
          ),
        ];

        const shuffledRoles = shuffle(rolePull);

        const enhancedPlayers: Player[] = shuffledPlayers.map((player) => {
          const [rolePulled] = shuffledRoles.splice(
            Math.floor(Math.random() * shuffledRoles.length),
            1
          );
          return {
            ...player,
            role: { team: rolePulled.role },
          };
        });

        return { ...game, started: true, players: enhancedPlayers };
      })
    );
  }

  // TODO remove any
  startTurn(game: Game, turn = 1): Observable<any> {
    const cardsPerPLayer = 6 - turn;

    if (turn < 5) {
      const randomPlayerIndex = Math.floor(Math.random() * game.players.length);

      let cardsNumberToDeal = game.players.length * cardsPerPLayer;
      let cardsNumberToDealTotal = cardsNumberToDeal;
      const { bombCardNumber, secureWireCardsNumber, defusingWireCardsNumber } =
        TIME_BOMB_CONFIG[game.players.length];

      const cardPull = [];

      cardPull.push(
        ...Array.from(Array(bombCardNumber).keys()).map(() => ({
          type: "bomb",
          id: uuid(),
        }))
      );
      cardPull.push(
        ...Array.from(Array(secureWireCardsNumber).keys()).map(() => ({
          type: "secureWire",
          id: uuid(),
        }))
      );
      cardPull.push(
        ...Array.from(Array(defusingWireCardsNumber).keys()).map(() => ({
          type: "defusingWire",
          id: uuid(),
        }))
      );

      const shuffledCards = shuffle(cardPull);

      const players = game.players.map((player) => ({
        ...player,
        turns: player.turns.push({ cards: [], ready: false }),
      }));

      while (cardsNumberToDeal > 0) {
        const [cardPulled] = shuffledCards.splice(
          Math.floor(Math.random() * shuffledCards.length),
          1
        );

        game.players[
          (randomPlayerIndex + cardsNumberToDealTotal - cardsNumberToDeal) %
            game.players.length
        ].turns[turn - 1].cards.push(cardPulled);
        cardsNumberToDeal--;
      }

      return this.gameRepository.findOneAndUpdate(
        { _id: game.id },
        { ...game, turn, leaderIndex: randomPlayerIndex },
        { new: true }
      );
    }
  }

  joinGame(
    gameId: string,
    player: Pick<Player, "id" | "nickname">
  ): Observable<Game> {
    console.log('i want to join a game')
    return this.gameRepository.findById(gameId).pipe(
      mergeMap(() =>
        this.gameRepository.findOneAndUpdate(
          { _id: gameId, "players.id": { $ne: player.id } },
          {
            $addToSet: {
              players: { id: player.id, nickname: player.nickname, turns: [] },
            },
          },
          { new: true }
        )
      ),
      mergeMap((game) =>
        !!game ? of(game) : this.gameRepository.findById(gameId)
      ),
      tap((game) => {console.log('post join game', game)})
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

  /**
   * Filter the game so that the players don't see other players cards
   * @param game
   * @param playerId
   * @returns
   */
  formatGame(game: Game, playerId: string): FormattedGame {
    return {
      ...game,
      players: game.players.map((playerFilter) => ({
        ...playerFilter,
        ...(playerFilter.id !== playerId
          ? { turns: undefined, role: undefined }
          : {}),
      })),
    };
  }
}
