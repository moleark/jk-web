"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouter = void 0;
const express_1 = require("express");
const search_1 = require("./search");
const epec_1 = require("../epec");
const getProductsInCatalog_1 = require("./getProductsInCatalog");
exports.apiRouter = express_1.Router({ mergeParams: true });
exports.apiRouter.get(['/search/:key', '/search/:key/:pageNumber(\\d+)', '/search/:key?debug'], search_1.search);
exports.apiRouter.get(['/product-catalog/:catalog', '/product-catalog/:catalog/:pageNumber(\\d+)', '/product-catalog/:catalog?debug'], getProductsInCatalog_1.getProductsInCatalog);
// 中石化登录地址
exports.apiRouter.get('/epec/login', epec_1.epecLogin);
// 药物所登录地址
exports.apiRouter.get('/UserIdentify.ashx', epec_1.epecLogin);
//# sourceMappingURL=index.js.map