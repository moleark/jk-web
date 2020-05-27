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
exports.DbProduct = void 0;
const db_1 = require("./db");
const tools_1 = require("../../tools");
class DbProduct extends db_1.Db {
    constructor() {
        super('product');
        let db = this.databaseName;
        this.sqlGetCategoryById = `
            SELECT  pc.id, pc.no, pc.parent, pc.isLeaf, pc.orderWithinParent, pcl.name
            FROM    ${db}.tv_productcategory pc
                    inner join ${db}.tv_productcategory_productcategorylanguage pcl on pcl.owner = pc.id
                    inner join ${db}.tv_productcategoryinclusion as ppi on ppi.category = pc.id and ppi.salesregion = ? and ppi.total > 0
            where   pc.$unit = 24 and pc.id = ? and pcl.language = ?;
        `;
        this.sqlGetChildrenCategories = `
            SELECT  pc.id, pc.no, pc.parent, pc.isLeaf, pc.orderWithinParent, pcl.name
            FROM    ${db}.tv_productcategory pc
                    inner join ${db}.tv_productcategory_productcategorylanguage pcl on pcl.owner = pc.id
                    inner join ${db}.tv_productcategoryinclusion as ppi on ppi.category = pc.id and ppi.salesregion = ? and ppi.total > 0
            where   pc.$unit = 24 and pc.parent = ? and pcl.language = ?;
        `;
        this.sqlGetRootCategories = `
            SELECT  pc.id, pc.no, pc.parent, pc.isLeaf, pc.orderWithinParent, pcl.name
            FROM    ${db}.tv_productcategory pc
                    inner join ${db}.tv_productcategory_productcategorylanguage pcl on pcl.owner = pc.id
                    inner join ${db}.tv_productcategoryinclusion as ppi on ppi.category = pc.id and ppi.salesregion = ? and ppi.total > 0
            where   pc.$unit = 24 and pc.parent is null and pcl.language = ?;
        `;
        this.sqlSearchProductByCategory = `
        SELECT   p.id, p.NO, p.brand, p.origin, p.description, p.descriptionc, p.imageurl, pc.chemical
                , pc.cas, pc.purity, pc.molecularfomula, pc.molecularweight
        FROM     ${db}.tv_productproductcategorycache as pp
                inner join ${db}.tv_productx as p on p.id = pp.product
                left join ${db}.tv_brand as b on p.$unit = b.$unit and p.brand = b.id
                LEFT join ${db}.tv_productchemical as pc on p.$unit = pc.$unit and p.id = pc.product
        WHERE 	pp.$unit =? AND pp.salesRegion=? AND pp.category=? 			
        LIMIT  ?,?;
        `;
        this.sqlSearchProductByKey = `
        SELECT   p.id, p.NO, p.brand, p.origin, p.description, p.descriptionc, p.imageurl, pc.chemical
                , pc.cas, pc.purity, pc.molecularfomula, pc.molecularweight
        FROM     ${db}.tv_productproductcategorycache as pp
                inner join ${db}.tv_productx as p on p.id = pp.product
                left join ${db}.tv_brand as b on p.$unit = b.$unit and p.brand = b.id
                LEFT join ${db}.tv_productchemical as pc on p.$unit = pc.$unit and p.id = pc.product
        WHERE 	pp.$unit =? AND pp.salesRegion=? AND (
                    p.origin like ? or p.description like ? 
                    or p.descriptionc like ? or pc.cas like ?
                )
        LIMIT  ?,?;
        `;
    }
    /**
     *
     * @param id
     */
    getCategoryById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.tableFromSql(this.sqlGetCategoryById, [tools_1.SALESREGION, id, tools_1.CHINESE]);
            if (ret && ret.length > 0)
                return ret[0];
            return undefined;
        });
    }
    /**
     * 获取目录节点的所有子节点
     * @param parentId
     */
    getChildrenCategories(parentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.tableFromSql(this.sqlGetChildrenCategories, [tools_1.SALESREGION, parentId, tools_1.CHINESE]);
            return ret;
        });
    }
    /**
     * 获取根目录节点
     */
    getRootCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.tableFromSql(this.sqlGetRootCategories, [tools_1.SALESREGION, tools_1.CHINESE]);
            return ret;
        });
    }
    /**
     * 查询目录节点中包含的产品
     * @param categoryId 目录节点id
     * @param pageStart 起始页
     * @param pageSize 每页产品个数
     */
    searchProductByCategory(categoryId, pageStart, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.tableFromSql(this.sqlSearchProductByCategory, [24, 5, categoryId, pageStart, pageSize]);
            return ret;
        });
    }
    /**
    * 查询目录节点中包含的产品
    * @param key 关键字
    * @param pageStart 起始页
    * @param pageSize 每页产品个数
    */
    searchProductByKey(key, pageStart, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            key = '%' + key + '%';
            const ret = yield this.tableFromSql(this.sqlSearchProductByKey, [24, 5, key, key, key, key, pageStart, pageSize]);
            return ret;
        });
    }
}
exports.DbProduct = DbProduct;
//# sourceMappingURL=dbProduct.js.map