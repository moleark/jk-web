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
const tools_1 = require("../tools");
const db_1 = require("../db");
const ejs = require("ejs");
function category(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let rootPath = tools_1.getRootPath(req);
        let current = req.params.current;
        let currentId = Number(current);
        let category = yield db_1.Dbs.product.getCategoryById(currentId);
        let children = yield db_1.Dbs.product.getChildrenCategories(currentId);
        category.children = children;
        let explain = "";
        let jk = ejs.fileLoader(tools_1.viewPath + '/headers/jk' + tools_1.ejsSuffix).toString();
        let hmInclude = ejs.fileLoader(tools_1.viewPath + '/headers/hm' + tools_1.ejsSuffix).toString();
        const ret = yield db_1.Dbs.content.postFromId(216);
        if (ret.length > 0) {
            let content = ret[0].content;
            if (content.charAt(0) === '#') {
                content = tools_1.hmToEjs(content);
                explain = jk + hmInclude + content;
                let datas = tools_1.buildData(req, {});
                explain = ejs.render(explain, datas);
            }
        }
        let productpage;
        let pageCount = 0;
        let pageSize = 30;
        productpage = yield db_1.Dbs.product.searchProductByCategory(currentId, pageCount * pageSize, pageSize);
        let data = tools_1.buildData(req, {
            current: current,
            category: category,
            path: rootPath + 'category/',
            productPath: rootPath + 'productCategory/',
            explain: explain
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