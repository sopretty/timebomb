"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const game_service_1 = require("../services/game.service");
const rxjs_1 = require("rxjs");
let GameGateway = exports.GameGateway = class GameGateway {
    constructor(gameService) {
        this.gameService = gameService;
        this.logger = new common_1.Logger("GameGateway");
    }
    joinGameMessage(client, payload) {
        client.join(payload.player.id);
        console.log('join', payload);
        return this.gameService.findOne(payload.gameId).pipe((0, rxjs_1.mergeMap)((game) => {
            if (game.players.length < 8 &&
                !game.started &&
                !game.players.find((player) => player.id === payload.player.id)) {
                return this.gameService.joinGame(payload.gameId, payload.player).pipe((0, rxjs_1.tap)((game) => {
                    client.data = {
                        playerId: payload.player.id,
                        gameId: payload.gameId,
                    };
                    game.players.forEach((player) => {
                        console.log("when somebody else join", player.id);
                        this.server.sockets
                            .to(player.id)
                            .emit("game_updated", this.gameService.formatGame(game, player.id));
                    });
                }));
            }
            if (game.players.length > 7 &&
                !game.started) {
                this.server.sockets.to(payload.player.id).emit("unjoinable_game");
                return (0, rxjs_1.of)(null);
            }
            if (game.started && !!game.players.find((player) => player.id === payload.player.id)) {
                game.players.forEach((player) => {
                    this.server.sockets
                        .to(player.id)
                        .emit("game_updated", this.gameService.formatGame(game, player.id));
                });
                return (0, rxjs_1.of)(null);
            }
            return (0, rxjs_1.of)(null);
        }));
    }
    startGameMessage(_client, payload) {
        return this.gameService.setup(payload.gameId).pipe((0, rxjs_1.mergeMap)((game) => {
            console.log('startturn');
            return this.gameService.startTurn(game);
        }), (0, rxjs_1.tap)((game) => {
            console.log(game);
            game.players.forEach((player) => {
                console.log(this.server.sockets, player.id, this.gameService.formatGame(game, player.id));
                this.server.sockets
                    .to(player.id)
                    .emit("game_started", this.gameService.formatGame(game, player.id));
            });
        }));
    }
    afterInit(_server) {
        this.logger.log("Init");
    }
    handleDisconnect(client) {
        console.log("disconnected", client.data);
        if (client.data.gameId && client.data.playerId) {
            this.gameService.findOne(client.data.gameId).pipe((0, rxjs_1.mergeMap)((game) => {
                console.log(game.started);
                if (!game.started) {
                    return this.gameService
                        .leaveGame(client.data.gameId, client.data.playerId)
                        .pipe((0, rxjs_1.tap)((game) => {
                        game.players.forEach((player) => {
                            console.log("handle disconnction");
                            this.server.sockets
                                .to(player.id)
                                .emit("game_updated", this.gameService.formatGame(game, player.id));
                        });
                    }));
                }
                return (0, rxjs_1.of)(null);
            }))
                .subscribe();
        }
        console.log('fin de disconnect');
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    handleConnection(client, ...args) {
        this.logger.log(`Client connected: ${client.id}`);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GameGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("join"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], GameGateway.prototype, "joinGameMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("start"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], GameGateway.prototype, "startGameMessage", null);
exports.GameGateway = GameGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: "*:*" }),
    __metadata("design:paramtypes", [game_service_1.GameService])
], GameGateway);
//# sourceMappingURL=game.gateway.js.map