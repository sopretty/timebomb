import * as mongoose from "mongoose";
import { Document } from "mongoose";
import { Player } from "./player.schemas";
export declare type GameDocument = Game & Document;
export declare const GAME_NAME_SCHEMA = "Game";
export declare class Game {
    creatorId: string;
    players: Player[];
    started: boolean;
}
export declare const GameSchema: mongoose.Schema<mongoose.Document<Game, any, any>, mongoose.Model<mongoose.Document<Game, any, any>, any, any, any>, any, any>;
