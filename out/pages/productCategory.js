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
exports.productCategory = void 0;
const tools_1 = require("../tools");
const tools_2 = require("../tools");
const db_1 = require("../db");
function productCategory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let rootPath = tools_1.getRootPath(req);
        let current = req.params.current;
        let currentId = Number(current);
        let productpage;
        let pageCount = 0;
        let pageSize = 5;
        pageCount = req.query.pageCount ? parseInt(req.query.pageCount) : 0;
        productpage = yield db_1.Dbs.product.searchProductByCategory(currentId, pageCount * pageSize, pageSize);
        let nextpage = pageCount + 1;
        let prepage = pageCount - 1;
        let data = yield tools_2.buildData(req, {
            nextpage: rootPath + 'product-catalog/' + currentId + '/?pageCount=' + nextpage,
            prepage: rootPath + 'product-catalog/' + currentId + '/?pageCount=' + prepage,
            current: current,
            productpage: productpage,
            pageCount: pageCount,
            path: rootPath + 'product/'
        });
        res.render('productCategory.ejs', data, (err, html) => {
            if (tools_1.ejsError(err, res) === true)
                return;
            res.end(html);
        });
    });
}
exports.productCategory = productCategory;
;
//# sourceMappingURL=productCategory.js.map