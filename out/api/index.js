"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouter = void 0;
const express_1 = require("express");
const search_1 = require("./search");
exports.apiRouter = express_1.Router({ mergeParams: true });
exports.apiRouter.get(['/search/:key', '/search/:key/:pageNumber(\\d+)'], search_1.search);
//# sourceMappingURL=index.js.map