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
exports.GameSchema = exports.Game = exports.GAME_NAME_SCHEMA = void 0;
const mongoose_1 = require("@nestjs/mongoose");
exports.GAME_NAME_SCHEMA = "Game";
let Game = exports.Game = class Game {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Game.prototype, "creatorId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Array)
], Game.prototype, "players", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Boolean)
], Game.prototype, "started", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Game.prototype, "currentTurnIndex", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Game.prototype, "id", void 0);
exports.Game = Game = __decorate([
    (0, mongoose_1.Schema)()
], Game);
exports.GameSchema = mongoose_1.SchemaFactory.createForClass(Game);
exports.GameSchema.set("toJSON", {
    virtuals: true,
    transform(doc, ret) {
        ret.id = doc._id.toString();
        delete ret._id;
        delete ret.__v;
    },
});
//# sourceMappingURL=game.schemas.js.map