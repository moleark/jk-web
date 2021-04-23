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
const neotrident_1 = require("../neotrident");
exports.legacyRouter = express_1.Router({ mergeParams: true });
exports.legacyRouter.get(/^\/(CH|en)\/products\/(.+?)\.html$/i, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let oldProductId = req.params[1];
    let product = yield db_1.Dbs.product.getProductByNo(oldProductId);
    if (product) {
        res.redirect('/product/' + product.id);
    }
    else {
        res.status(404);
        next();
    }
}));
exports.legacyRouter.get(/^\/(CH|en)\/products\/search\/(fulltextsearch|cas|mdl|originalid|description|mf|productname|chemid|methodtype|advancedSearch)\/(.+?)\.html$/i, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // legacyRouter.get(/^\/(CH|en)\/products\/search\/fulltextsearch\/(.+)\.html$/i, async (req: Request, res: Response) => {
    res.redirect("/search/" + req.params[2]);
}));
exports.legacyRouter.get([/^\/(zh\-cn|en-us)\/product-catalog\/parent\/(\d+)\.html$/i,
    /^\/(zh\-cn|en-us)\/product-catalog\/(\d+)(\/\d+\/\d+)?.html$/i,
    /^\/(CH|en)\/products\/search\/productcategory\/(\d+)(\/\d+)?.html$/i], (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let oldCategoryId = req.params[1];
    let productCategory = yield db_1.Dbs.product.getCategoryByNo(oldCategoryId);
    if (productCategory) {
        res.redirect('/product-catalog/' + productCategory.id);
    }
    else {
        res.status(404);
        next();
    }
}));
//  
exports.legacyRouter.get(/^(\/(CH|EN))?\/index(.(aspx|html))?$/i, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.redirect('/');
}));
/**
 * 待完善
 */
exports.legacyRouter.get([/^\/ProductResources.aspx$/i], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.redirect('/product/mscu/msds');
    /*
    let { query } = req;
    if (!query) {
        res.redirect('/product/mscu/msds');
        return;
    }

    let { langugage, originalId, type } = query;
    switch (type) {
        case 'coa':
            break;
        case 'msds':
            break;
        case "spec":
            break;
        case "usermanu":
            break;
        default:
            break;
    }
    */
}));
exports.legacyRouter.get([/^\/(en\-US|zh\-CN)\/product-catalog.html$/i], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let querystring = '';
    let { originalUrl } = req;
    let pos = originalUrl.indexOf('?');
    if (pos > 0) {
        querystring = originalUrl.substring(pos);
    }
    res.redirect("/product-catalog" + querystring);
}));
exports.legacyRouter.get([/^\/Company-inf.aspx$/i, /^\/company-core.aspx/i], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.redirect("/ch/about");
}));
exports.legacyRouter.get([/^\/informationContent.aspx$/i, /^\/news.aspx/i], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.redirect("/information");
}));
exports.legacyRouter.get(/^\/brand.aspx$/i, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.redirect("/ch/recommended-brand");
}));
exports.legacyRouter.get(/^\/contactUs.aspx$/i, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.redirect("/ch/contact");
}));
exports.legacyRouter.get(/^\/job.aspx$/i, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.redirect("/job");
}));
exports.legacyRouter.get(/^\/chemical.aspx$/i, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.redirect("/product-catalog/47");
}));
exports.legacyRouter.get(/^\/Sisanaly.aspx$/i, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.redirect("/product-catalog/470");
}));
exports.legacyRouter.get(/^\/LifeScience.aspx$/i, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.redirect("/product-catalog/1013");
}));
exports.legacyRouter.get(/^\/MaterialScience.aspx$/i, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.redirect("/product-catalog/1219");
}));
exports.legacyRouter.get(/^\/InstrumentConsumables.aspx$/i, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.redirect("/product-catalog/1545");
}));
// 药物所登录地址
exports.legacyRouter.get(/^\/UserIdentity.ashx$/i, neotrident_1.neotridentLogin);
//# sourceMappingURL=index.js.map