"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getType_1 = require("../getType");
function default_1(value, type) {
    return (0, getType_1.default)(value) === type;
}
exports.default = default_1;
