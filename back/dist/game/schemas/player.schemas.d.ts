import { Document } from "mongoose";
export declare type PlayerDocument = Player & Document;
export declare const PLAYER_NAME_SCHEMA = "Player";
export declare class Player {
    uuid: string;
    nickname: string;
}
export declare const PlayerSchema: import("mongoose").Schema<Document<Player, any, any>, import("mongoose").Model<Document<Player, any, any>, any, any, any>, any, any>;
