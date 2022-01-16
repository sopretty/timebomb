import * as mongoose from "mongoose";
import { Document } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Player } from "./player.schemas";

export type GameDocument = Game & Document;

export const GAME_NAME_SCHEMA = "Game";

@Schema()
export class Game {
  @Prop({ required: true })
  creatorId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Player" })
  players: Player[];
}

export const GameSchema = SchemaFactory.createForClass(Game);
