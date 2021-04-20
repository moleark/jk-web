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
exports.casSubclass = void 0;
const db_1 = require("../db");
const tools_1 = require("../tools");
let cacheHtml;
//测试
function casSubclass(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let rootPath = tools_1.getRootPath(req);
        let current = req.params.current;
        let pageCount = 0;
        let pageSize = 5;
        pageCount = req.query.pageCount ? parseInt(req.query.pageCount) : 0;
        const casList = yield db_1.Dbs.productIndex.getCASByInterval(tools_1.SALESREGION, +current);
        let data = yield tools_1.buildData(req, {
            current: current,
            casList: casList,
            productPath: rootPath + 'search/'
        });
        res.render('casSubclass.ejs', data, (err, html) => {
            if (tools_1.ejsError(err, res) === true)
                return;
            res.end(cacheHtml = html);
        });
    });
}
exports.casSubclass = casSubclass;
;
//# sourceMappingURL=casSubclass.js.map