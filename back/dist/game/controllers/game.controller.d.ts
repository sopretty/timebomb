import { Observable } from "rxjs";
import { Game } from "../schemas/game.schemas";
import { GameService } from "../services/game.service";
export declare class CreateGameBody {
    creatorId: string;
}
export declare class GameController {
    private readonly gameService;
    constructor(gameService: GameService);
    createGame(body: CreateGameBody): Observable<Game>;
    findOneGame(gameId: string): Observable<Game>;
}
