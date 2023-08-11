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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameController = exports.CreateGameBody = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const game_service_1 = require("../services/game.service");
class CreateGameBody {
}
exports.CreateGameBody = CreateGameBody;
let GameController = exports.GameController = class GameController {
    constructor(gameService) {
        this.gameService = gameService;
    }
    createGame(body) {
        return this.gameService.create(body.creatorId);
    }
    findOneGame(gameId) {
        return this.gameService.findOne(gameId);
    }
};
__decorate([
    (0, common_1.Put)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateGameBody]),
    __metadata("design:returntype", rxjs_1.Observable)
], GameController.prototype, "createGame", null);
__decorate([
    (0, common_1.Get)("/:gameId"),
    __param(0, (0, common_1.Param)("gameId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", rxjs_1.Observable)
], GameController.prototype, "findOneGame", null);
exports.GameController = GameController = __decorate([
    (0, common_1.Controller)("games"),
    __metadata("design:paramtypes", [game_service_1.GameService])
], GameController);
//# sourceMappingURL=game.controller.js.map