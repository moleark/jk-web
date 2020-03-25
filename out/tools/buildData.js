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
function buildData(req, data) {
    if (!data)
        data = {};
    if (!data.$title)
        data.$title = '';
    data.$root = getRootPath(req);
    data.shopJsPath = req.app.locals.shopJsPath;
    return data;
}
exports.buildData = buildData;
//# sourceMappingURL=buildData.js.map