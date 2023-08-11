import { Document } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Player } from "./player.schemas";

export type GameDocument = Game & Document;

export const GAME_NAME_SCHEMA = "Game";

@Schema()
export class Game {
  @Prop({ required: true })
  creatorId: string;

  @Prop()
  players: Player[];

  @Prop()
  started?: boolean;

  @Prop({default: 0})
  currentTurnIndex: number;

  @Prop()
  id: string;
}

export const GameSchema = SchemaFactory.createForClass(Game);

GameSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    ret.id = doc._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});
