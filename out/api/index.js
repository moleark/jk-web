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
exports.apiRouter = void 0;
const express_1 = require("express");
const search_1 = require("./search");
const epec_1 = require("../epec");
const getProductsInCatalog_1 = require("./getProductsInCatalog");
const replacePostContentUrl_1 = require("../tools/replacePostContentUrl");
const joint_1 = require("../joint");
const neotrident_1 = require("../neotrident");
const PunchOut_1 = require("../punchout/PunchOut");
exports.apiRouter = express_1.Router({ mergeParams: true });
exports.apiRouter.get(['/search/:key', '/search/:key/:pageNumber(\\d+)', '/search/:key?debug'], search_1.search);
exports.apiRouter.get('/product/search', search_1.search);
exports.apiRouter.get(['/product-catalog/:catalog/products', '/product-catalog/:catalog/products/:pageNumber(\\d+)', '/product-catalog/:catalog/products?debug'], getProductsInCatalog_1.getProductsInCatalog);
// 中石化登录地址
exports.apiRouter.get('/epec/login', epec_1.epecLogin);
// 二次登录验证(要删除)
exports.apiRouter.get('/epec/clientLogin', joint_1.clientLogin);
// 药物所登录地址配置再legacyUrl中
// 二次登录验证
exports.apiRouter.get('/joint/clientLogin', joint_1.clientLogin);
// 临时用于修改贴文内容中旧的url 
exports.apiRouter.get('/replacePostContentUrl/:from(\\d+)-:to(\\d+)', (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    let { params } = req;
    let { from, to } = params;
    let iFrom = parseInt(from);
    let iTo = parseInt(to);
    try {
        yield replacePostContentUrl_1.replacePostContentUrl(iFrom, iTo);
        rep.end('ok');
    }
    catch (error) {
        rep.json(error);
    }
}));
// 诺华用户认证
exports.apiRouter.post(/^\/PunchOut\.aspx$/i, PunchOut_1.authentication);
// 药物所登录地址
exports.apiRouter.get(/^\/UserIdentity\.ashx$/i, neotrident_1.neotridentLogin);
//# sourceMappingURL=index.js.map