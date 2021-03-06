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
exports.technicalSupport = void 0;
const db_1 = require("../db");
const tools_1 = require("../tools");
let cacheHtml;
//测试
function technicalSupport(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let rootPath = tools_1.getRootPath(req);
        const sortName = yield db_1.Dbs.productIndex.getSortNameIntervalGroup(tools_1.SALESREGION);
        let list = [];
        for (var i = 0; i < sortName.length; i++) {
            let subSortName = yield db_1.Dbs.productIndex.SortNameInterval(tools_1.SALESREGION, sortName[i].id);
            list.push(subSortName);
        }
        let data = yield tools_1.buildData(req, {
            productPath: '',
            sortName: '',
        });
        res.render('technicalSupport.ejs', data, (err, html) => {
            if (tools_1.ejsError(err, res) === true)
                return;
            res.end(cacheHtml = html);
        });
    });
}
exports.technicalSupport = technicalSupport;
;
//# sourceMappingURL=technicalSupport.js.map