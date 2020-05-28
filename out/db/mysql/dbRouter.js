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
exports.DbRouter = void 0;
const db_1 = require("./db");
class DbRouter extends db_1.Db {
    constructor() {
        super('router');
        let db = this.databaseName;
        this.sqlRouter = `
            SELECT id, start, end 
            FROM ${db}.tv_casinterval
            WHERE salesregion = ? 
            ORDER BY id;
        `;
    }
    /**
     * 获取某销售区域的CAS区间设置
     * @param salesRegionId
     */
    getRoute() {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.tableFromSql(this.sqlRouter, [1]);
            return ret;
        });
    }
}
exports.DbRouter = DbRouter;
//# sourceMappingURL=dbRouter.js.map