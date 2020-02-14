"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getRootPath_1 = require("./getRootPath");
function buildData(req, data) {
    if (!data)
        data = {};
    if (!data.title)
        data.$title = '';
    data.$root = getRootPath_1.getRootPath(req);
    //data.$device = 'm';
    return data;
}
exports.buildData = buildData;
//# sourceMappingURL=buildData.js.map