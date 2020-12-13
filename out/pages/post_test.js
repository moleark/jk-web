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
exports.post_test = void 0;
const db_1 = require("../db");
const post_1 = require("./post");
const tools_1 = require("../tools");
function post_test(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let rootPath = tools_1.getRootPath(req);
        let id = req.params.id;
        //获取内容
        const ret = yield db_1.Dbs.content.postFromId(id);
        if (ret.length === 0) {
            res.status(404).end();
            return;
        }
        try {
            let content, current, postsubject, postproduct;
            let discounts = [];
            let correlation = [];
            //获取内容明细
            current = ret[0];
            //获取优惠贴文
            discounts = yield db_1.Dbs.content.getDiscountsPost(id);
            //相关贴文
            correlation = yield db_1.Dbs.content.getCorrelationPost(id);
            //获取贴文的栏目
            postsubject = yield db_1.Dbs.content.postSubject(id);
            //获取贴文产品
            postproduct = yield db_1.Dbs.content.getPostProduct(id);
            if (postproduct.length === 0) {
                postproduct = yield db_1.Dbs.content.getRecommendProducts(id);
            }
            //获取产品目录树根节点
            const rootcategories = yield db_1.Dbs.product.getRootCategories();
            //获取贴点贴文
            let cacheHotPosts;
            let lastHotTick = 0;
            let now = Date.now();
            if (cacheHotPosts === undefined || now - lastHotTick > 60 * 1000) {
                lastHotTick = now;
                cacheHotPosts = yield db_1.Dbs.content.getHotPost();
            }
            //获取栏目
            let subject;
            subject = yield db_1.Dbs.content.getSubject();
            content = yield post_1.renderPostArticle(current);
            let data = tools_1.buildData(req, {
                $title: current.caption,
                path: rootPath + 'post/',
                current: current,
                subject: subject,
                discounts: discounts,
                correlation: correlation,
                hotPosts: cacheHotPosts,
                rootcategories: rootcategories,
                content: content,
                postsubject: postsubject,
                postproduct: postproduct,
                titleshow: false
            });
            res.render('post/post.ejs', data);
            tools_1.ipHit(req, id);
        }
        catch (e) {
            tools_1.ejsError(e, res);
        }
    });
}
exports.post_test = post_test;
//# sourceMappingURL=post_test.js.map