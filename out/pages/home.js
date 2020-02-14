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
let lastHomeTick = Date.now();
let cacheHtml;
let cacheHotPosts;
let lastHotTick = 0;
//测试
function home(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let rootPath = tools_1.getRootPath(req);
        tools_1.ipHit(req, -1);
        let now = Date.now();
        if (false && cacheHtml !== undefined) {
            let ht = lastHomeTick;
            lastHomeTick = now;
            if (lastHomeTick - ht < 3600 * 1000) {
                res.end(cacheHtml);
                return;
            }
            ;
        }
        const ret = yield db_1.Db.content.homePostList();
        if (cacheHotPosts === undefined || now - lastHotTick > 10 * 60 * 1000) {
            lastHotTick = now;
            let ret = yield db_1.Db.content.execProc('tv_hotPosts', [db_1.Db.unit, 0]);
            cacheHotPosts = ret[0];
        }
        let data = {
            root: rootPath,
            title: undefined,
            path: rootPath + 'post/',
            news: ret,
            categories: data_1.categories,
            productNews: data_1.productNews,
            newsletter: data_1.newsletter,
            latestProducts: data_1.latestProducts,
            hotPosts: cacheHotPosts,
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