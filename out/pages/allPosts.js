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
const tools_1 = require("../tools");
let lastHomeTick = Date.now();
let cacheHtml;
let cacheHotPosts;
let lastHotTick = 0;
//测试
function allPosts(req, res) {
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
        const ret = yield db_1.Dbs.content.allPosts();
        let data = tools_1.buildData(req, {
            path: rootPath + 'post/',
            news: ret,
        });
        res.render('all-posts.ejs', data, (err, html) => {
            if (tools_1.ejsError(err, res) === true)
                return;
            res.end(cacheHtml = html);
        });
    });
}
exports.allPosts = allPosts;
;
//# sourceMappingURL=allPosts.js.map