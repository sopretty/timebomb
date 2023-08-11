import { Document } from "mongoose";
import { Player } from "./player.schemas";
export type GameDocument = Game & Document;
export declare const GAME_NAME_SCHEMA = "Game";
export declare class Game {
    creatorId: string;
    players: Player[];
    started?: boolean;
    currentTurnIndex: number;
    id: string;
}
export declare const GameSchema: import("mongoose").Schema<Document<Game, any, any>, import("mongoose").Model<Document<Game, any, any>, any, any, any>, any, any>;
