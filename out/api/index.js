"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouter = void 0;
const express_1 = require("express");
const search_1 = require("./search");
const epec_1 = require("../epec");
exports.apiRouter = express_1.Router({ mergeParams: true });
exports.apiRouter.get(['/search/:key', '/search/:key/:pageNumber(\\d+)', '/search/:key?debug'], search_1.search);
// 中石化
exports.apiRouter.get('/epec/login', epec_1.epecLogin);
exports.apiRouter.get('/epec/saveOrder', epec_1.epecLogin);
// 药物所
exports.apiRouter.get('/UserIdentify.ashx', epec_1.epecLogin);
//# sourceMappingURL=index.js.map