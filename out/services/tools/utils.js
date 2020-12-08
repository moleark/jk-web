"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasChineseChar = void 0;
function hasChineseChar(key) {
    return /[\u4E00-\u9FFF]+/g.test(key);
}
exports.hasChineseChar = hasChineseChar;
//# sourceMappingURL=utils.js.map