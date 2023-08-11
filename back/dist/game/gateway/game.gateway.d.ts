import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { GameService } from "../services/game.service";
import { Observable } from "rxjs";
import { Game } from "../schemas/game.schemas";
import { Player } from "../schemas/player.schemas";
export declare class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly gameService;
    server: Server;
    constructor(gameService: GameService);
    private logger;
    joinGameMessage(client: Socket, payload: {
        gameId: string;
        player: Pick<Player, "id" | "nickname">;
    }): Observable<any>;
    startGameMessage(_client: Socket, payload: {
        gameId: string;
    }): Observable<Game>;
    afterInit(_server: Server): void;
    handleDisconnect(client: Socket): void;
    handleConnection(client: Socket, ...args: any[]): void;
}
