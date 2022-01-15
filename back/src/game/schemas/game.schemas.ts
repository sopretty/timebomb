import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GameDocument = Game & Document;

export const GAME_NAME_SCHEMA = 'Game';

@Schema()
export class Game {
  @Prop({ required: true })
  creatorId: string;
}

export const GameSchema = SchemaFactory.createForClass(Game);
