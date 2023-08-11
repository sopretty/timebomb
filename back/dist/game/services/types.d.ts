import { Game } from "../schemas/game.schemas";
import { Player, Role, Turn } from "../schemas/player.schemas";
export type FormattedPlayer = Player & {
    id: string;
    nickname: string;
    turns?: Turn[];
    leader?: boolean;
    index: number;
    role?: Role;
};
export interface FormattedGame extends Game {
    players: FormattedPlayer[];
}
