import { FilterQuery, Model, QueryOptions, UpdateQuery, UpdateWithAggregationPipeline } from "mongoose";
import { Observable } from "rxjs";
import { Game, GameDocument } from "../schemas/game.schemas";
export declare class GameRepository {
    private gameModel;
    constructor(gameModel: Model<GameDocument>);
    save(creatorId: string): Observable<Game>;
    findById(id: string, projection?: any | null, options?: QueryOptions | null): Observable<Game>;
    updateOne(filter?: FilterQuery<Game>, update?: UpdateQuery<Game> | UpdateWithAggregationPipeline, options?: QueryOptions | null): Observable<any>;
    findOneAndUpdate(filter?: FilterQuery<Game>, update?: UpdateQuery<Game>, options?: QueryOptions | null): Observable<Game | null>;
    find(): Observable<any>;
}
