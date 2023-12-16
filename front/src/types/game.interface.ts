export interface Card {
  type: "defusingWire" | "bomb" | "secureWire";
  revealed: boolean;
  id: string;
}

export interface Turn {
  cards: Card[];
}

export interface Role {
  team: "moriarty" | "sherlock";
}

export interface Player {
  id: string;

  nickname: string;

  turns?: Turn[];

  leader?: boolean;

  index: number;

  role?: Role;
}

export interface Game {
  creatorId: string;

  players: Player[];

  started?: boolean;

  currentTurnIndex: number;

  id: string;
}
