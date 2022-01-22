import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from "@nestjs/websockets";
import { Logger } from "@nestjs/common";
import { Socket, Server } from "socket.io";
import { GameService } from "../services/game.service";
import { mergeMap, Observable, tap } from "rxjs";
import { Game } from "../schemas/game.schemas";

@WebSocketGateway({ cors: "*:*" })
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly gameService: GameService) {}

  private logger: Logger = new Logger("GameGateway");

  @SubscribeMessage("join")
  joinGameMessage(
    client: Socket,
    payload: {
      gameId: string;
      player: { id: string; nickname: string };
    }
  ): Observable<Game> {
    // TODO: check that there is no more than 7 players before adding
    client.data = {
      playerId: payload.player.id,
      gameId: payload.gameId,
    };

    client.join(payload.gameId);

    return this.gameService.joinGame(payload.gameId, payload.player).pipe(
      tap((game) => {
        this.server.sockets.to(payload.gameId).emit("game_updated", game);
      })
    );
  }

  @SubscribeMessage("start")
  startGameMessage(
    _client: Socket,
    payload: {
      gameId: string;
    }
  ): Observable<any> {
    return this.gameService.startGame(payload.gameId).pipe(
      mergeMap(() => this.gameService.findOne(payload.gameId)),
      tap((game) => {
        this.server.sockets.to(payload.gameId).emit("game_started", game);
      })
    );
  }

  afterInit(_server: Server) {
    this.logger.log("Init");
  }

  handleDisconnect(client: Socket) {
    if (client.data.gameId && client.data.playerId) {
      this.gameService
        .leaveGame(client.data.gameId, client.data.playerId)
        .pipe(
          tap((game) => {
            this.server.sockets
              .to(client.data.gameId)
              .emit("game_updated", game);
          })
        )
        .subscribe();
    }

    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
