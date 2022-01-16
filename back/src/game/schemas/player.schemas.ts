import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type PlayerDocument = Player & Document;

export const PLAYER_NAME_SCHEMA = "Player";

@Schema()
export class Player {
  @Prop({ required: true })
  uuid: string;

  @Prop({ required: true })
  nickname: string;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
