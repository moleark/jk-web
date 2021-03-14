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
exports.category = void 0;
const tools_1 = require("../tools");
const db_1 = require("../db");
const post_1 = require("./post");
function category(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let current = req.params.current;
        let currentId = Number(current);
        let category = yield db_1.Dbs.product.getCategoryById(currentId);
        if (!category) {
            res.status(404).end();
            return;
        }
        let children = yield db_1.Dbs.product.getChildrenCategories(currentId);
        category.children = children;
        const categoryPost = yield db_1.Dbs.content.categoryPost(currentId);
        let postArticle = "";
        const explainlist = yield db_1.Dbs.content.getCategoryInstruction(currentId);
        if (explainlist.length > 0) {
            let postID = explainlist[0].post;
            const ret = yield db_1.Dbs.content.postFromId(postID);
            if (ret.length > 0) {
                postArticle = yield post_1.renderPostArticle(req, ret[0]);
            }
        }
        let rootPath = tools_1.getRootPath(req);
        let data = yield tools_1.buildData(req, {
            current: current,
            category: category,
            postArticle: postArticle,
            categoryPost: categoryPost,
            path: rootPath + 'product-catalog/',
            productPath: rootPath + 'product-catalog/',
            postpath: rootPath + 'post/',
            titleshow: true
        });
        res.render('category.ejs', data, (err, html) => {
            if (tools_1.ejsError(err, res) === true)
                return;
            res.end(html);
        });
    });
}
exports.category = category;
;
//# sourceMappingURL=category.js.map