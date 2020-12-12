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
exports.language = void 0;
const ejs = require("ejs");
const tools_1 = require("../tools");
const tools_2 = require("../tools");
const db_1 = require("../db");
function language(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //获取产品目录树根节点
            const rootcategories = yield db_1.Dbs.product.getRootCategories();
            let data = tools_1.buildData(req, { rootcategories });
            let header = ejs.fileLoader(tools_2.viewPath + 'headers/header' + tools_2.ejsSuffix).toString();
            let homeHeader = ejs.fileLoader(tools_2.viewPath + 'headers/home-header' + tools_2.ejsSuffix).toString();
            let body = ejs.fileLoader(tools_2.viewPath + 'language/language.ejs').toString();
            let homeFooter = ejs.fileLoader(tools_2.viewPath + 'footers/home-footer' + tools_2.ejsSuffix).toString();
            let html = ejs.render(header
                + homeHeader
                + body
                + homeFooter, data);
            res.end(html);
        }
        catch (err) {
            console.error(err);
            res.end('error in parsing: ' + err.message);
        }
    });
}
exports.language = language;
;
//# sourceMappingURL=language.js.map