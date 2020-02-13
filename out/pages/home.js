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
const db_1 = require("../db");
const data_1 = require("../data");
const tools_1 = require("../tools");
let lastTime = new Date();
let cacheHtml;
//测试
function home(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (false && cacheHtml !== undefined) {
            if (Date.now() - lastTime.getTime() < 3600 * 1000) {
                res.end(cacheHtml);
                return;
            }
            ;
        }
        const ret = yield db_1.Db.content.homePostList();
        //let content = ejs.fileLoader('./ejs/a.ejs').toString();
        let data = {
            title: undefined,
            path: 'post/',
            news: ret,
            categories: data_1.categories,
            productNews: data_1.productNews,
            newsletter: data_1.newsletter,
            latestProducts: data_1.latestProducts,
        };
        res.render('home.ejs', data, (err, html) => {
            if (tools_1.ejsError(err, res) === true)
                return;
            res.end(cacheHtml = html);
        });
    });
}
exports.home = home;
;
//# sourceMappingURL=home.js.map