"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getType(data) {
    var type = Object.prototype.toString
        .call(data)
        .replace(/\[?\]?/g, '') // 'object String'
        .replace('object ', '') // String
        .replace(/\w/, function (r) { return r.toLowerCase(); }); // string
    return type;
}
exports.default = getType;
