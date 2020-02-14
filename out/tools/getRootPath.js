"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const root = '/jk-web';
const rootEndSlash = root + '/';
function getRootPath(req) {
    let low = req.baseUrl.toLowerCase();
    if (low === root || low.indexOf(rootEndSlash) >= 0)
        return rootEndSlash;
    return '/';
}
exports.getRootPath = getRootPath;
//# sourceMappingURL=getRootPath.js.map