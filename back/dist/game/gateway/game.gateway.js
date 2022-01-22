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
let GameGateway = class GameGateway {
    constructor(gameService) {
        this.gameService = gameService;
        this.logger = new common_1.Logger("GameGateway");
    }
    joinGameMessage(client, payload) {
        client.data = {
            playerId: payload.player.id,
            gameId: payload.gameId,
        };
        client.join(payload.gameId);
        return this.gameService.joinGame(payload.gameId, payload.player).pipe((0, rxjs_1.tap)((game) => {
            this.server.sockets.to(payload.gameId).emit("game_updated", game);
        }));
    }
    startGameMessage(_client, payload) {
        return this.gameService.startGame(payload.gameId).pipe((0, rxjs_1.mergeMap)(() => this.gameService.findOne(payload.gameId)), (0, rxjs_1.tap)((game) => {
            this.server.sockets.to(payload.gameId).emit("game_started", game);
        }));
    }
    afterInit(_server) {
        this.logger.log("Init");
    }
    handleDisconnect(client) {
        if (client.data.gameId && client.data.playerId) {
            this.gameService
                .leaveGame(client.data.gameId, client.data.playerId)
                .pipe((0, rxjs_1.tap)((game) => {
                this.server.sockets
                    .to(client.data.gameId)
                    .emit("game_updated", game);
            }))
                .subscribe();
        }
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
GameGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: "*:*" }),
    __metadata("design:paramtypes", [game_service_1.GameService])
], GameGateway);
exports.GameGateway = GameGateway;
//# sourceMappingURL=game.gateway.js.map