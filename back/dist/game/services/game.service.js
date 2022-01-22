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
exports.GameService = void 0;
const game_repository_1 = require("./../repository/game.repository");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const rxjs_1 = require("rxjs");
const game_schemas_1 = require("../schemas/game.schemas");
const TIME_BOMB_CONFIG = {
    4: {
        bombCardNumber: 1,
        secureWireCardsNumber: 15,
        defusingWireCardsNumber: 4,
    },
    5: {
        bombCardNumber: 1,
        secureWireCardsNumber: 19,
        defusingWireCardsNumber: 5,
    },
    6: {
        bombCardNumber: 1,
        secureWireCardsNumber: 23,
        defusingWireCardsNumber: 6,
    },
    7: {
        bombCardNumber: 1,
        secureWireCardsNumber: 27,
        defusingWireCardsNumber: 7,
    },
    8: {
        bombCardNumber: 1,
        secureWireCardsNumber: 31,
        defusingWireCardsNumber: 8,
    },
};
let GameService = class GameService {
    constructor(gameModel, gameRepository) {
        this.gameModel = gameModel;
        this.gameRepository = gameRepository;
    }
    create(creatorId) {
        return this.gameRepository.save(creatorId);
    }
    findOne(gameId) {
        return this.gameRepository.findById(gameId);
    }
    startGame(gameId) {
        return this.findOne(gameId).pipe((0, rxjs_1.map)((game) => {
            const turn = 1;
            const cardsPerPLayer = 6 - turn;
            if (turn < 5) {
                const players = [...game.players];
                const randomPlayerIndex = Math.floor(Math.random() * game.players.length);
                let cardsNumberToDeal = game.players.length * cardsPerPLayer;
                let cardsNumberToDealTotal = cardsNumberToDeal;
                const { bombCardNumber, secureWireCardsNumber, defusingWireCardsNumber, } = TIME_BOMB_CONFIG[game.players.length];
                while (cardsNumberToDeal > 0) {
                    players[randomPlayerIndex +
                        ((cardsNumberToDealTotal - cardsNumberToDeal) %
                            game.players.length)];
                    cardsNumberToDeal--;
                }
            }
        }), (0, rxjs_1.mergeMap)((game) => (0, rxjs_1.from)(this.gameModel
            .updateOne({ _id: gameId }, {
            started: true,
        })
            .exec())), (0, rxjs_1.mapTo)(null));
    }
    joinGame(gameId, player) {
        return this.gameRepository
            .findOneAndUpdate({ _id: gameId, "players.id": { $ne: player.id } }, {
            $addToSet: {
                players: { id: player.id, nickname: player.nickname },
            },
        }, { new: true })
            .pipe((0, rxjs_1.mergeMap)((game) => !!game ? (0, rxjs_1.of)(game) : this.gameRepository.findById(gameId)));
    }
    leaveGame(gameId, playerId) {
        return this.gameRepository
            .findOneAndUpdate({ _id: gameId, "players.id": playerId }, {
            $pull: { players: { id: playerId } },
        }, { new: true })
            .pipe((0, rxjs_1.mergeMap)((game) => !!game ? (0, rxjs_1.of)(game) : this.gameRepository.findById(gameId)));
    }
    findAll() {
        return this.gameRepository.find();
    }
};
GameService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(game_schemas_1.GAME_NAME_SCHEMA)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        game_repository_1.GameRepository])
], GameService);
exports.GameService = GameService;
//# sourceMappingURL=game.service.js.map