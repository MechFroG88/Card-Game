"use strict";
exports.__esModule = true;
exports.Player = void 0;
var Player = /** @class */ (function () {
    function Player(id) {
        this.id = id;
    }
    ;
    Player.prototype.hasID = function (id) {
        return this.id === id;
    };
    return Player;
}());
exports.Player = Player;
