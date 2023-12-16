import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type PlayerDocument = Player & Document;

export const PLAYER_NAME_SCHEMA = "Player";

export class Card {
  type: "defusingWire" | "bomb" | "secureWire";
  revealed: boolean;
  id: string;
}

export class Turn {
  cards: Card[];
  ready: boolean;
}

export class Role {
  team: "moriarty" | "sherlock";
}

@Schema()
export class Player {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  nickname: string;

  @Prop()
  turns: Turn[];

  @Prop()
  leader?: boolean;

  @Prop()
  index: number;

  @Prop()
  role: Role;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);

PlayerSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    ret.id = doc._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
