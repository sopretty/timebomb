import { GameRepository } from "./../repository/game.repository";
import { Model } from "mongoose";
import { Observable } from "rxjs";
import { Game, GameDocument } from "../schemas/game.schemas";
import { Player } from "../schemas/player.schemas";
export declare class GameService {
    private gameModel;
    private readonly gameRepository;
    constructor(gameModel: Model<GameDocument>, gameRepository: GameRepository);
    create(creatorId: string): Observable<Game>;
    findOne(gameId: string): Observable<Game>;
    startGame(gameId: string): Observable<null>;
    joinGame(gameId: string, player: Player): Observable<Game>;
    leaveGame(gameId: string, playerId: string): Observable<Game>;
    findAll(): Observable<Game[]>;
}
