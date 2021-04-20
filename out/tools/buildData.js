"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildData = exports.getRootPath = void 0;
const db_1 = require("../db");
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
    return __awaiter(this, void 0, void 0, function* () {
        if (!data)
            data = {};
        if (!data.$title)
            data.$title = '';
        data.$root = getRootPath(req);
        data.shopJsPath = req.app.locals.shopJsPath;
        //获取产品目录树根节点
        const rootcategories = yield db_1.Dbs.product.getRootCategories();
        data.rootcategories = rootcategories;
        return data;
    });
}
exports.buildData = buildData;
//# sourceMappingURL=buildData.js.map