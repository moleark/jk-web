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
const db_1 = require("./db");
class DbProductIndex extends db_1.Db {
    constructor() {
        super('productIndex');
        let db = this.databaseName;
        this.sqlCASInterval = `
            SELECT id, start, end 
            FROM ${db}.tv_casinterval
            WHERE salesregion = ? 
            ORDER BY id;
        `;
        this.sqlGetCASByInterval = `
            SELECT  cas 
            FROM ${db}.tv_casinsalesregion
            WHERE salesregion = ? and casinterval = ?
            ORDER BY cas;
        `;
        this.sqlGetSortNameIntervalGroup = `
            SELECT  b.id, b.name
            FROM    ${db}.tv_sortnameintervalgroupsalesregion a
                    inner join ${db}.tv_sortnameintervalgroup b on a.group = b.id
            WHERE   a.salesregion = ?;
        `;
        this.sqlSortNameInterval = `
            SELECT  id, start, end 
            FROM ${db}.tv_sortnameinterval
            WHERE salesregion = ? and group = ?
            ORDER BY id;
        `;
        /*
        this.sqlGetProductBySortNameInterval = `
            SELECT  b.*
            FROM ${db}.tv_sortnameinsalesregion a
                    inner join ${db}.tv_productx b on a.product = b.id
            WHERE a.salesregion = ? and a.sortnameinterval = ?
            ORDER BY a.product;
        `;
        */
    }
    /**
     * 获取某销售区域的CAS区间设置
     * @param salesRegionId
     */
    CASInterval(salesRegionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.tableFromSql(this.sqlCASInterval, [salesRegionId]);
            return ret;
        });
    }
    /**
     * 获取某销售区域的某CAS区间中包含的CAS列表
     * @param salesRegionId
     * @param casInervalId
     */
    getCASByInterval(salesRegionId, casInervalId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.tableFromSql(this.sqlGetCASByInterval, [salesRegionId, casInervalId]);
            return ret;
        });
    }
    /**
     * 获取某销售区域的SortName区间分组
     * @param salesRegionId
     */
    getSortNameIntervalGroup(salesRegionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.tableFromSql(this.sqlGetSortNameIntervalGroup, [salesRegionId]);
            return ret;
        });
    }
    /**
     * 获取某销售区域的SortName区间设置
     * @param salesRegionId
     */
    SortNameInterval(salesRegionId, groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.tableFromSql(this.sqlSortNameInterval, [salesRegionId, groupId]);
            return ret;
        });
    }
}
exports.DbProductIndex = DbProductIndex;
//# sourceMappingURL=dbProductIndex.js.map