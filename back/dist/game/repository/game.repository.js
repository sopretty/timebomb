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
exports.GameRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const rxjs_1 = require("rxjs");
const game_schemas_1 = require("../schemas/game.schemas");
let GameRepository = exports.GameRepository = class GameRepository {
    constructor(gameModel) {
        this.gameModel = gameModel;
    }
    save(creatorId) {
        const createdCat = new this.gameModel({ creatorId });
        return (0, rxjs_1.from)(createdCat.save()).pipe((0, rxjs_1.map)((gameDocument) => gameDocument.toJSON()));
    }
    findById(id, projection, options) {
        return (0, rxjs_1.from)(this.gameModel.findById(id, projection, options)).pipe((0, rxjs_1.map)((gameDocument) => !!gameDocument && gameDocument.toJSON()));
    }
    updateOne(filter, update, options) {
        return (0, rxjs_1.from)(this.gameModel.updateOne(filter, update, options)).pipe();
    }
    findOneAndUpdate(filter, update, options) {
        return (0, rxjs_1.from)(this.gameModel.findOneAndUpdate(filter, update, options)).pipe((0, rxjs_1.map)((gameDocument) => {
            if (!!gameDocument && !!gameDocument.toJSON) {
                return gameDocument.toJSON();
            }
            return null;
        }));
    }
    find() {
        return (0, rxjs_1.from)(this.gameModel.find()).pipe((0, rxjs_1.tap)((gameDocument) => console.log("find", { gameDocument })));
    }
};
exports.GameRepository = GameRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(game_schemas_1.GAME_NAME_SCHEMA)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], GameRepository);
//# sourceMappingURL=game.repository.js.map