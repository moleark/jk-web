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
exports.subjectpost = void 0;
const tools_1 = require("../tools");
const db_1 = require("../db");
function subjectpost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let rootPath = tools_1.getRootPath(req);
        try {
            //获取当前栏目
            let currentId = Number(req.params.current);
            let currentSubject = yield db_1.Dbs.content.subjectByid(currentId);
            let caption = currentSubject.name;
            //获取当前页贴文
            let postpage;
            let pageCount;
            let pageSize = 10;
            pageCount = req.query.pageCount ? parseInt(req.query.pageCount) : 0;
            postpage = yield db_1.Dbs.content.subjectPost(currentId, pageCount * pageSize, pageSize);
            let nextpage = pageCount + 1;
            let prepage = pageCount - 1;
            //获取栏目
            let subject;
            subject = yield db_1.Dbs.content.getSubject();
            //获取产品目录树根节点
            const rootcategories = yield db_1.Dbs.product.getRootCategories();
            //获取热点贴文
            let cacheHotPosts;
            let lastHotTick = 0;
            let now = Date.now();
            if (cacheHotPosts === undefined || now - lastHotTick > 60 * 1000) {
                lastHotTick = now;
                cacheHotPosts = yield db_1.Dbs.content.getHotPost();
            }
            let data = tools_1.buildData(req, {
                nextpage: rootPath + 'subjectpost/' + currentId + '?pageCount=' + nextpage,
                prepage: rootPath + 'subjectpost/' + currentId + '?pageCount=' + prepage,
                path: rootPath + 'post/',
                post: postpage,
                pageCount: pageCount,
                hotPosts: cacheHotPosts,
                subject: subject,
                caption: caption,
                rootcategories: rootcategories,
                titleshow: false
            });
            console.log(nextpage, 'nextpage');
            res.render('subjectpost.ejs', data, (err, html) => {
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
exports.subjectpost = subjectpost;
;
//# sourceMappingURL=subjectpost.js.map