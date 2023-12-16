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
    client.join(payload.player.id);
console.log('join', payload)
    return this.gameService.findOne(payload.gameId).pipe(
      mergeMap((game) => {

        // if the game hasn't started yet and that the game is still joinable
        if(game.players.length < 8 &&
          !game.started &&
          !game.players.find((player) => player.id === payload.player.id)) {
            return this.gameService.joinGame(payload.gameId, payload.player).pipe(
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
            )
          }

          // if the game hasn't started but it's full
          if(game.players.length > 7 &&
            !game.started){
              this.server.sockets.to(payload.player.id).emit("unjoinable_game")
              return of(null);
            }

          // if the game has started and that you're part of it (ie. reconnection)
          if(game.started && !!game.players.find((player) => player.id === payload.player.id)){
            game.players.forEach((player) => {
              // TODO create a function to filter cards from other players
              this.server.sockets
                .to(player.id)
                .emit(
                  "game_updated",
                  this.gameService.formatGame(game, player.id)
                );

            });
            return of(null);
          }

          return of(null);
      }),
    );
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
        console.log('startturn');
        return this.gameService.startTurn(game)}),
      tap((game: Game) => {
        console.log(game)
        game.players.forEach((player) => {
          console.log(this.server.sockets, player.id, this.gameService.formatGame(game, player.id))
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

  handleDisconnect(client: Socket) {
    // TODO: instead of checking the client.data, we should get all none finished game, check the players and if they are part of them, leave them
    console.log("disconnected", client.data);
    if (client.data.gameId && client.data.playerId) {
      this.gameService.findOne(client.data.gameId).pipe(
        mergeMap((game) =>
        {
          console.log(game.started)
          if(!game.started){
            return this.gameService
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
          }

          return of(null);
        }))
        .subscribe();
    }
console.log('fin de disconnect')
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
