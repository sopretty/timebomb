import { Observable } from "rxjs";
import { FormattedGame, GameService } from "../services/game.service";
export declare class CreateGameBody {
    creatorId: string;
}
export declare class GameController {
    private readonly gameService;
    constructor(gameService: GameService);
    createGame(body: CreateGameBody): Observable<FormattedGame>;
    findOneGame(gameId: string): Observable<FormattedGame>;
}
