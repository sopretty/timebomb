import { Document } from "mongoose";
export type PlayerDocument = Player & Document;
export declare const PLAYER_NAME_SCHEMA = "Player";
export declare class Card {
    type: "defusingWire" | "bomb" | "secureWire";
    revealed: boolean;
}
export declare class Turn {
    cards: Card[];
    ready: boolean;
}
export declare class Role {
    team: "moriarty" | "sherlock";
}
export declare class Player {
    id: string;
    nickname: string;
    turns: Turn[];
    leader?: boolean;
    index: number;
    role: Role;
}
export declare const PlayerSchema: import("mongoose").Schema<Document<Player, any, any>, import("mongoose").Model<Document<Player, any, any>, any, any, any>, any, any>;
