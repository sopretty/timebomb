import { Model } from "mongoose";
import { Observable } from "rxjs";
import { GameRepository } from "./../repository/game.repository";
import { Game, GameDocument } from "../schemas/game.schemas";
import { Player } from "../schemas/player.schemas";
import { FormattedGame } from "./types";
export declare class GameService {
    private gameModel;
    private readonly gameRepository;
    constructor(gameModel: Model<GameDocument>, gameRepository: GameRepository);
    create(creatorId: string): Observable<Game>;
    findOne(gameId: string): Observable<Game>;
    setup(gameId: string): Observable<Game>;
    startTurn(game: Game, turn?: number): Observable<any>;
    joinGame(gameId: string, player: Pick<Player, "id" | "nickname">): Observable<Game>;
    leaveGame(gameId: string, playerId: string): Observable<Game>;
    findAll(): Observable<Game[]>;
    formatGame(game: Game, playerId: string): FormattedGame;
}
