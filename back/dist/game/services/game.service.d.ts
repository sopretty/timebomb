import { Model } from "mongoose";
import { Observable } from "rxjs";
import { Game, GameDocument } from "../schemas/game.schemas";
export interface FormattedGame {
    id: string;
    creatorId: string;
    players: {
        uuid: string;
        nickname: string;
    }[];
}
export declare class GameService {
    private gameModel;
    constructor(gameModel: Model<GameDocument>);
    create(creatorId: string): Observable<FormattedGame>;
    findOne(gameId: string): Observable<FormattedGame>;
    findAll(): Observable<Game[]>;
    private formatGame;
}
