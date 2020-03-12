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
let cacheHtml;
//测试
function productName(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let rootPath = tools_1.getRootPath(req);
        const SortName = yield db_1.Dbs.productIndex.getSortNameIntervalGroup(tools_1.SALESREGION);
        const subSortName = yield db_1.Dbs.productIndex.SortNameInterval(tools_1.SALESREGION, SortName[0].id);
        console.log(subSortName, 'SortName');
        let data = tools_1.buildData(req, {
            path: rootPath,
            SortName: SortName,
        });
        res.render('productName.ejs', data, (err, html) => {
            if (tools_1.ejsError(err, res) === true)
                return;
            res.end(cacheHtml = html);
        });
    });
}
exports.productName = productName;
;
//# sourceMappingURL=productName.js.map