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
exports.information = void 0;
const db_1 = require("../db");
const tools_1 = require("../tools");
const setPreNextPage_1 = require("../tools/setPreNextPage");
function information(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let discounts = [];
            let correlation = [];
            //获取当前页贴文
            let pageIndex;
            let pageSize = 10;
            pageIndex = req.query.pageIndex ? parseInt(req.query.pageIndex) : 0;
            let postpage = yield db_1.Dbs.content.informationPage(pageIndex * pageSize, pageSize + 1);
            let { prepage, nextpage } = setPreNextPage_1.setPreNextPage(pageIndex, pageSize, postpage.length);
            if (nextpage > 0)
                postpage.pop();
            //获取栏目
            let subject;
            subject = yield db_1.Dbs.content.getAllSubjects();
            //获取热点贴文
            let cacheHotPosts;
            let lastHotTick = 0;
            let now = Date.now();
            if (cacheHotPosts === undefined || now - lastHotTick > 60 * 1000) {
                lastHotTick = now;
                cacheHotPosts = yield db_1.Dbs.content.getHotPost();
            }
            //获取优惠贴文
            discounts = yield db_1.Dbs.content.getDiscountsPost(0);
            //相关贴文
            correlation = yield db_1.Dbs.content.getCorrelationPost(0);
            let data = yield yield tools_1.buildData(req, {
                nextpage: nextpage,
                prepage: prepage,
                post: postpage,
                pageIndex: pageIndex,
                hotPosts: cacheHotPosts,
                subject: subject,
                discounts: discounts,
                correlation: correlation,
                titleshow: true
            });
            res.render('information.ejs', data, (err, html) => {
                if (tools_1.ejsError(err, res) === true)
                    return;
                res.end(html);
            });
        }
        catch (err) {
            console.error(err);
            res.end('error in parsing: ' + err.message);
        }
    });
}
exports.information = information;
;
//# sourceMappingURL=information.js.map