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
import { iif, map, mergeMap, Observable, of, tap } from "rxjs";
import { Game } from "../schemas/game.schemas";
import { Player } from "../schemas/player.schemas";

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
      player: Pick<Player, "id" | "nickname">;
    }
  ): Observable<any> {
    console.log("join", payload.player.id);
    client.join(payload.player.id);

    return this.gameService.findOne(payload.gameId).pipe(
      mergeMap((game) =>
        iif(
          () =>
            game.players.length < 8 &&
            // et que la partie n'est pas déjà commencé ?
            !game.players.find((player) => player.id === payload.player.id),
          this.gameService.joinGame(payload.gameId, payload.player).pipe(
            tap((game) => {
              client.data = {
                playerId: payload.player.id,
                gameId: payload.gameId,
              };

              game.players.forEach((player) => {
                console.log("when somebody else join", player.id);
                // TODO create a function to filter cards from other players
                this.server.sockets
                  .to(player.id)
                  .emit(
                    "game_updated",
                    this.gameService.formatGame(game, player.id)
                  );
              });
            })
          ),
          of(null).pipe(
            tap(() => {
              this.server.sockets.to(payload.player.id).emit("unjoinable_game");
            })
          )
        )
      )
    );

    return;
  }

  @SubscribeMessage("start")
  startGameMessage(
    _client: Socket,
    payload: {
      gameId: string;
    }
  ): Observable<Game> {
    return this.gameService.setup(payload.gameId).pipe(
      mergeMap((game) => {
        console.log(game);
        return this.gameService.startTurn(game)}),
      tap((game: Game) => {

        game.players.forEach((player) => {
          // TODO create a function to filter cards from other players
          this.server.sockets
            .to(player.id)
            .emit("game_started", this.gameService.formatGame(game, player.id));
        });
      })
    );
  }

  afterInit(_server: Server) {
    this.logger.log("Init");
  }

  // TODO: if game has started, we shouldn't do anything
  handleDisconnect(client: Socket) {
    console.log("disconnected");
    if (client.data.gameId && client.data.playerId) {
      this.gameService
        .leaveGame(client.data.gameId, client.data.playerId)
        .pipe(
          tap((game) => {
            game.players.forEach((player) => {
              console.log("handle disconnction");
              // TODO create a function to filter cards from other players
              this.server.sockets
                .to(player.id)
                .emit(
                  "game_updated",
                  this.gameService.formatGame(game, player.id)
                );
            });
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
