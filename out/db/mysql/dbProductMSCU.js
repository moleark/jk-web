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
exports.DbProductMSCU = void 0;
const db_1 = require("./db");
class DbProductMSCU extends db_1.Db {
    constructor() {
        super('product');
        let db = this.databaseName;
        this.sqlGetProductMsdsFile = `
            SELECT  pm.product, pm.language, pm.filename
            FROM    ${db}.tv_productmsdsfile as pm
            where   pm.$unit = 24 and pm.product = ? and pm.language = ?;
        `;
        this.sqlGetProductVersions = `
            select  language
            FROM    ${db}.tv_productmsdsfile as pm
                    inner join ${db}.tv_product p as p on p.$unit = pm.$unit and p.id = pm.product
            where   p.$unit = 24 and p.origin = ? and p.brand in (18, 71);
        `;
        this.sqlGetProductSpecFile = `
            SELECT  ps.product, ps.filename
            FROM    ${db}.tv_productspecfile as ps
            where   ps.$unit = 24 and ps.product = ?;
        `;
    }
    /**
     * 获取产品指定语言版本的MSDS文件
     * @param productId
     * @param langId
     */
    getProductMsds(productId, langId) {
        return __awaiter(this, void 0, void 0, function* () {
            let param = [productId, langId];
            const ret = yield this.tableFromSql(this.sqlGetProductMsdsFile, param);
            if (ret && ret.length > 0)
                return ret[0];
            return undefined;
        });
    }
    /**
     *
     * @param jkOrigin
     */
    getProductMsdsVersions(jkOrigin) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.tableFromSql(this.sqlGetProductVersions, [jkOrigin]);
            if (ret && ret.length > 0)
                return ret[0];
            return undefined;
        });
    }
    /**
     * 根据主键获取指定产品的Spec文件
     * @param productId productId
     */
    getProductSpec(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.tableFromSql(this.sqlGetProductSpecFile, productId);
            if (ret && ret.length > 0)
                return ret[0];
            return undefined;
        });
    }
}
exports.DbProductMSCU = DbProductMSCU;
//# sourceMappingURL=dbProductMSCU.js.map