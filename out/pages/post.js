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
exports.renderPostContent = exports.renderPostArticle = exports.formattedTable = exports.post = void 0;
const ejs = require("ejs");
const db_1 = require("../db");
const tools_1 = require("../tools");
function post(req, res) {
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
            subject = yield db_1.Dbs.content.getAllSubjects();
            content = yield renderPostArticle(req, current);
            let data = tools_1.buildData(req, {
                $title: current.caption,
                path: rootPath + 'post/',
                subject: subject,
                discounts: discounts,
                correlation: correlation,
                hotPosts: cacheHotPosts,
                rootcategories: rootcategories,
                postArticle: content,
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
exports.post = post;
;
function formattedTable(content) {
    return __awaiter(this, void 0, void 0, function* () {
        let currentNode;
        for (currentNode = 0; currentNode < content.length; currentNode++) {
            let start, datastart, dataend;
            start = content.indexOf('#productlist', currentNode);
            if (start === -1)
                return content;
            datastart = content.indexOf('\n', start);
            dataend = content.indexOf('\n', datastart + 1);
            dataend = (dataend === -1) ? content.length : dataend;
            let data = content.substring(datastart + 1, dataend);
            let list = data.split('|');
            let replacement = "";
            let listdata = yield db_1.Dbs.product.searchProductByOrigin(list);
            replacement = formattedTableRow(listdata);
            let regexp = content.substring(start, dataend);
            content = content.replace(regexp, replacement);
            currentNode = currentNode > dataend ? currentNode : dataend;
        }
        return content;
    });
}
exports.formattedTable = formattedTable;
function formattedTableRow(productlist) {
    if (productlist.length === 0)
        return "";
    const imagePath = 'https://www.jkchemical.com/static/Structure/';
    const productPath = "https://shop.jkchemical.com/?type=product&product=";
    let header = `<div class="row product-introduct">`;
    let footers = `</div>`;
    let content = ``;
    productlist.forEach(element => {
        let { brandname, origin, description, descriptionc, cas } = element;
        content += `<div class="col-lg-3">
                <div class="img-wrap">
                    <a href="` + productPath + `"><img src="` + imagePath + `"></a>
                </div>
            </div>
            <div class="col-lg-9 each-product">
                <h3>
                    <a href="` + productPath + `">
                    ` + description + `
                        <br>
                        ` + descriptionc + `
                    </a>
                </h3>
                <p>产品编号：  ` + origin + ` | CAS： ` + cas + `| 品牌： ` + brandname + ` </p>
            </div>
            <div class="col-lg-12 mt-lg-2">
            </div>`;
    });
    return header + content + footers;
}
/**
 * 渲染整个post
 * @param req
 * @param article
 */
function renderPostArticle(req, article) {
    return __awaiter(this, void 0, void 0, function* () {
        // return ejs.render(template, buildData(req, { article }));
        let result = '';
        // content = ejs.render(template, buildData(req, { article }));
        let content = yield renderPostContent(req, article);
        ejs.renderFile(tools_1.viewPath + '/post/post-article.ejs', { postArticle: article, content }, (error, str) => {
            result = str;
        });
        return result;
    });
}
exports.renderPostArticle = renderPostArticle;
/**
 * 渲染贴文内容（和上面的区别是不带有预定模板）
 * @param req
 * @param article
 */
function renderPostContent(req, article) {
    return __awaiter(this, void 0, void 0, function* () {
        let content = article.content;
        content = yield formattedTable(content);
        if (content.charAt(0) === '#') {
            content = tools_1.hmToEjs(content);
        }
        let template = ejs.fileLoader(tools_1.viewPath + '/headers/jk' + tools_1.ejsSuffix).toString()
            + ejs.fileLoader(tools_1.viewPath + '/headers/hm' + tools_1.ejsSuffix).toString()
            + content;
        return ejs.render(template, tools_1.buildData(req, { article }));
    });
}
exports.renderPostContent = renderPostContent;
//# sourceMappingURL=post.js.map