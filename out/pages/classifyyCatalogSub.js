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
const tools_2 = require("../tools");
const db_1 = require("../db");
function classifyyCatalogSub(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let index = req.params.index;
        let current = req.params.current;
        let idx = req.params.idx;
        let indexes = req.params.indexes;
        const categories = yield db_1.Dbs.product.getRootCategories();
        let categorieschildr;
        let subdirectory;
        let catalogSub;
        let catalog;
        for (let i = 0; i < categories.length; i++) {
            let category = categories[i];
            let { id } = category;
            categories[i].children = yield db_1.Dbs.product.getChildrenCategories(id);
            id = categories[current].id;
            categorieschildr = yield db_1.Dbs.product.getChildrenCategories(id);
        }
        for (let k = 0; k < categorieschildr.length; k++) {
            let { id } = categorieschildr[k];
            categorieschildr[k].children = yield db_1.Dbs.product.getChildrenCategories(id);
            id = categorieschildr[index].id;
            subdirectory = yield db_1.Dbs.product.getChildrenCategories(id);
        }
        for (let i = 0; i < subdirectory.length; i++) {
            let { id } = subdirectory[i];
            subdirectory[i].children = yield db_1.Dbs.product.getChildrenCategories(id);
            id = subdirectory[idx].id;
            catalog = yield db_1.Dbs.product.getChildrenCategories(id);
        }
        for (let i = 0; i < catalog.length; i++) {
            let { id } = catalog[i];
            catalog[i].children = yield db_1.Dbs.product.getChildrenCategories(id);
            id = catalog[indexes].id;
            catalogSub = yield db_1.Dbs.product.getChildrenCategories(id);
        }
        let data = tools_2.buildData(req, {
            title: catalog[indexes].name,
            indexes: indexes,
            // 右边标题目录
            catalog: catalog,
            // 左边一条所有子集
            catalogSub: catalogSub,
        });
        res.render('classifyyCatalogSub.ejs', data, (err, html) => {
            if (tools_1.ejsError(err, res) === true)
                return;
            res.end(html);
        });
    });
}
exports.classifyyCatalogSub = classifyyCatalogSub;
;
//# sourceMappingURL=classifyyCatalogSub.js.map