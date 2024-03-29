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
exports.PlayerSchema = exports.Player = exports.Role = exports.Turn = exports.Card = exports.PLAYER_NAME_SCHEMA = void 0;
const mongoose_1 = require("@nestjs/mongoose");
exports.PLAYER_NAME_SCHEMA = "Player";
class Card {
}
exports.Card = Card;
class Turn {
}
exports.Turn = Turn;
class Role {
}
exports.Role = Role;
let Player = exports.Player = class Player {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Player.prototype, "id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Player.prototype, "nickname", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Array)
], Player.prototype, "turns", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Boolean)
], Player.prototype, "leader", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Player.prototype, "index", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Role)
], Player.prototype, "role", void 0);
exports.Player = Player = __decorate([
    (0, mongoose_1.Schema)()
], Player);
exports.PlayerSchema = mongoose_1.SchemaFactory.createForClass(Player);
exports.PlayerSchema.set("toJSON", {
    virtuals: true,
    transform(doc, ret) {
        ret.id = doc._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
//# sourceMappingURL=player.schemas.js.map