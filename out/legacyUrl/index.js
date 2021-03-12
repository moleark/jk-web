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
exports.legacyRouter = void 0;
const express_1 = require("express");
const db_1 = require("../db");
exports.legacyRouter = express_1.Router({ mergeParams: true });
exports.legacyRouter.get(/^\/CH\/products\/(.+?)\.html$/i, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let oldProductId = req.params[0];
    let product = yield db_1.Dbs.product.getProductByNo(oldProductId);
    if (product) {
        res.redirect('/product/' + product.id);
    }
}));
exports.legacyRouter.get(/^\/CH\/products\/search\/fulltextsearch\/(.+?)\.html$/i, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.redirect("/search/" + req.params[0]);
}));
exports.legacyRouter.get([/^\/zh-cn\/product-catalog\/parent\/(\d+)\.html$/i,
    /^\/zh-cn\/product-catalog\/(\d+)(\/\d+\/\d+)?.html$/i,
    /^\/CH\/products\/search\/productcategory\/(\d+)(\/\d+)?.html$/i], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let oldCategoryId = req.params[0];
    let productCategory = yield db_1.Dbs.product.getProductByNo(oldCategoryId);
    if (productCategory) {
        res.redirect('/product-catalog/' + productCategory.id);
    }
}));
//# sourceMappingURL=index.js.map