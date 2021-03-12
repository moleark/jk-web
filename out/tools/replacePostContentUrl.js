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
exports.replacePostContentUrl = void 0;
const db_1 = require("../db");
/**
 * 该方法用于将贴文内容中存在的指向老官网的url替换为对应的新官网的url
 * @returns
 */
function replacePostContentUrl(from, to) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let index = from; index <= to; index++) {
            let ret = yield db_1.Dbs.content.postFromId(index);
            if (ret.length === 0)
                continue;
            let post = ret[0];
            let { content } = post;
            if (!content)
                continue;
            let result1 = yield replaceProduct(content);
            let result2 = yield replaceProductSearch(result1.content);
            let result3 = yield replaceProductCategory(result2.content);
            if (result1.changed || result2.changed || result3.changed) {
                try {
                    yield db_1.Dbs.content.replaceContentUrl(index, result3.content);
                }
                catch (error) {
                    throw error;
                }
            }
        }
    });
}
exports.replacePostContentUrl = replacePostContentUrl;
/**
 * 替换贴文内容中的单个产品链接
 * @param content
 * @returns
 */
function replaceProduct(content) {
    return __awaiter(this, void 0, void 0, function* () {
        let pattern = new RegExp(/https?:\/\/(www.)?jkchemical.com\/CH\/products\/(.+?)\.html/ig);
        let matchResult, thisResult = {}, matched = false;
        while ((matchResult = pattern.exec(content)) !== null) {
            thisResult[matchResult[2]] = matchResult[0];
        }
        for (const p in thisResult) {
            let product = yield db_1.Dbs.product.getProductByNo(p);
            if (product) {
                content = content.split(thisResult[p]).join('https://web.jkchemical.com/product/' + product.id);
                matched = true;
            }
        }
        return { changed: matched, content };
    });
}
/**
 * 替换贴文内容中的产品搜索链接
 * @param content
 * @returns
 */
function replaceProductSearch(content) {
    return __awaiter(this, void 0, void 0, function* () {
        let pattern = /https?:\/\/(www.)?jkchemical.com\/CH\/products\/search\/fulltextsearch\/(.+?)\.html/ig;
        let exists = content.search(pattern);
        content = content.replace(pattern, "https://web.jkchemical.com/search/$2");
        return { changed: exists !== -1, content };
    });
}
/**
 * 替换贴文内容中的产品目录树节点链接
 * @param content
 * @returns
 */
function replaceProductCategory(content) {
    return __awaiter(this, void 0, void 0, function* () {
        let matchResult, thisResult = {}, matched = false;
        let pattern = new RegExp(/https?:\/\/(www.)?jkchemical.com\/zh-cn\/product-catalog\/parent\/(\d+)\.html/ig);
        while ((matchResult = pattern.exec(content)) !== null) {
            thisResult[matchResult[2]] = matchResult[0];
        }
        let pattern2 = new RegExp(/https?:\/\/(www.)?jkchemical.com\/zh-cn\/product-catalog\/(\d+)(\/\d+\/\d+)?.html/ig);
        while ((matchResult = pattern2.exec(content)) !== null) {
            thisResult[matchResult[2]] = matchResult[0];
        }
        let pattern3 = new RegExp(/https?:\/\/(www.)?jkchemical.com\/CH\/products\/search\/productcategory\/(\d+)(\/\d+)?.html/ig);
        while ((matchResult = pattern3.exec(content)) !== null) {
            thisResult[matchResult[2]] = matchResult[0];
        }
        for (const p in thisResult) {
            let productCategory = yield db_1.Dbs.product.getCategoryByNo(p);
            if (productCategory) {
                // content = content.replace(thisResult[p], 'https://web.jkchemical.com/product-catalog/' + productCategory.id);
                content = content.split(thisResult[p]).join('https://web.jkchemical.com/product-catalog/' + productCategory.id);
                matched = true;
            }
        }
        return { changed: matched, content };
    });
}
//# sourceMappingURL=replacePostContentUrl.js.map