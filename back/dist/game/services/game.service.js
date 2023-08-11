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
const mongoose_1 = require("mongoose");
const rxjs_1 = require("rxjs");
const uuid_1 = require("uuid");
const common_1 = require("@nestjs/common");
const mongoose_2 = require("@nestjs/mongoose");
const shuffle = require("lodash.shuffle");
const game_repository_1 = require("./../repository/game.repository");
const game_schemas_1 = require("../schemas/game.schemas");
const TIME_BOMB_CONFIG = {
    4: {
        moriartyPlayerNumber: 2,
        sherlockPlayerNumber: 3,
        bombCardNumber: 1,
        secureWireCardsNumber: 15,
        defusingWireCardsNumber: 4,
    },
    5: {
        moriartyPlayerNumber: 2,
        sherlockPlayerNumber: 3,
        bombCardNumber: 1,
        secureWireCardsNumber: 19,
        defusingWireCardsNumber: 5,
    },
    6: {
        moriartyPlayerNumber: 2,
        sherlockPlayerNumber: 4,
        bombCardNumber: 1,
        secureWireCardsNumber: 23,
        defusingWireCardsNumber: 6,
    },
    7: {
        moriartyPlayerNumber: 3,
        sherlockPlayerNumber: 5,
        bombCardNumber: 1,
        secureWireCardsNumber: 27,
        defusingWireCardsNumber: 7,
    },
    8: {
        moriartyPlayerNumber: 3,
        sherlockPlayerNumber: 5,
        bombCardNumber: 1,
        secureWireCardsNumber: 31,
        defusingWireCardsNumber: 8,
    },
};
let GameService = exports.GameService = class GameService {
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
    setup(gameId) {
        return this.findOne(gameId).pipe((0, rxjs_1.map)((game) => {
            let players = game.players.map((player) => (Object.assign(Object.assign({}, player), { turns: [] })));
            if (players.length === 1) {
                players = [
                    ...game.players,
                    ...game.players,
                    ...game.players,
                    ...game.players,
                ].map((player) => (Object.assign(Object.assign({}, player), { turns: [] })));
            }
            const shuffledPlayers = shuffle(players).map((player, index) => (Object.assign(Object.assign(Object.assign({}, player), { index }), (index === 0 ? { leader: true } : {}))));
            const { sherlockPlayerNumber, moriartyPlayerNumber } = TIME_BOMB_CONFIG[shuffledPlayers.length];
            const rolePull = [
                ...Array.from(Array(sherlockPlayerNumber).keys()).map((_ele, index) => ({
                    role: "sherlock",
                    index,
                })),
                ...Array.from(Array(moriartyPlayerNumber).keys()).map((_ele, index) => ({
                    role: "moriarty",
                    index,
                })),
            ];
            const shuffledRoles = shuffle(rolePull);
            const enhancedPlayers = shuffledPlayers.map((player) => {
                const [rolePulled] = shuffledRoles.splice(Math.floor(Math.random() * shuffledRoles.length), 1);
                return Object.assign(Object.assign({}, player), { role: { team: rolePulled.role } });
            });
            return Object.assign(Object.assign({}, game), { started: true, players: enhancedPlayers });
        }));
    }
    startTurn(game, turn = 1) {
        const cardsPerPLayer = 6 - turn;
        if (turn < 5) {
            const randomPlayerIndex = Math.floor(Math.random() * game.players.length);
            let cardsNumberToDeal = game.players.length * cardsPerPLayer;
            let cardsNumberToDealTotal = cardsNumberToDeal;
            const { bombCardNumber, secureWireCardsNumber, defusingWireCardsNumber } = TIME_BOMB_CONFIG[game.players.length];
            const cardPull = [];
            cardPull.push(...Array.from(Array(bombCardNumber).keys()).map(() => ({
                type: "bomb",
                id: (0, uuid_1.v4)(),
            })));
            cardPull.push(...Array.from(Array(secureWireCardsNumber).keys()).map(() => ({
                type: "secureWire",
                id: (0, uuid_1.v4)(),
            })));
            cardPull.push(...Array.from(Array(defusingWireCardsNumber).keys()).map(() => ({
                type: "defusingWire",
                id: (0, uuid_1.v4)(),
            })));
            const shuffledCards = shuffle(cardPull);
            const players = game.players.map((player) => (Object.assign(Object.assign({}, player), { turns: player.turns.push({ cards: [], ready: false }) })));
            while (cardsNumberToDeal > 0) {
                const [cardPulled] = shuffledCards.splice(Math.floor(Math.random() * shuffledCards.length), 1);
                game.players[(randomPlayerIndex + cardsNumberToDealTotal - cardsNumberToDeal) %
                    game.players.length].turns[turn - 1].cards.push(cardPulled);
                cardsNumberToDeal--;
            }
            return this.gameRepository.findOneAndUpdate({ _id: game.id }, Object.assign(Object.assign({}, game), { turn, leaderIndex: randomPlayerIndex }), { new: true });
        }
    }
    joinGame(gameId, player) {
        console.log('i want to join a game');
        return this.gameRepository.findById(gameId).pipe((0, rxjs_1.mergeMap)(() => this.gameRepository.findOneAndUpdate({ _id: gameId, "players.id": { $ne: player.id } }, {
            $addToSet: {
                players: { id: player.id, nickname: player.nickname, turns: [] },
            },
        }, { new: true })), (0, rxjs_1.mergeMap)((game) => !!game ? (0, rxjs_1.of)(game) : this.gameRepository.findById(gameId)), (0, rxjs_1.tap)((game) => { console.log('post join game', game); }));
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
    formatGame(game, playerId) {
        return Object.assign(Object.assign({}, game), { players: game.players.map((playerFilter) => (Object.assign(Object.assign({}, playerFilter), (playerFilter.id !== playerId
                ? { turns: undefined, role: undefined }
                : {})))) });
    }
};
exports.GameService = GameService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(game_schemas_1.GAME_NAME_SCHEMA)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        game_repository_1.GameRepository])
], GameService);
//# sourceMappingURL=game.service.js.map