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
function category(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let current = req.params.current;
        let currentId = Number(current);
        let category = yield db_1.Dbs.product.getCategoryById(currentId);
        let children = yield db_1.Dbs.product.getChildrenCategories(currentId);
        category.children = children;
        let productpage;
        let pageCount = 0;
        let pageSize = 30;
        productpage = yield db_1.Dbs.product.searchProductByCategory(currentId, pageCount * pageSize, pageSize);
        let data = tools_2.buildData(req, {
            current: current,
            category: category,
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