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
            content = yield replaceProduct(content);
            content = yield replaceProductSearch(content);
            try {
                yield db_1.Dbs.content.replaceContentUrl(index, content);
            }
            catch (error) {
                throw error;
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
        let pattern = new RegExp(/https?:\/\/(www.)?jkchemical.com\/CH\/products\/(\w+)\.html/ig);
        let matched, thisResult = {};
        while ((matched = pattern.exec(content)) !== null) {
            let oldProductId = matched[2];
            let product = yield db_1.Dbs.product.getProductByNo(oldProductId);
            if (product) {
                thisResult[oldProductId] = [matched[0], 'https://www.jkchemical.com/product/' + product.id];
            }
        }
        for (const p in thisResult) {
            content = content.replace(thisResult[p][0], thisResult[p][1]);
        }
        return content;
    });
}
/**
 * 替换贴文内容中的产品搜索链接
 * @param content
 * @returns
 */
function replaceProductSearch(content) {
    return __awaiter(this, void 0, void 0, function* () {
        let pattern = /https?:\/\/(www.)?jkchemical.com\/CH\/products\/search\/fulltextsearch\/(\w+)\.html/ig;
        let exists = content.match(pattern);
        content = content.replace(pattern, "https://www.jkchemical.com/search/$2");
        return content;
    });
}
//# sourceMappingURL=replacePostContentUrl.js.map