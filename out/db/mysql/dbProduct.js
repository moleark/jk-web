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
const SALESREGION = 1;
const CHINESE = 197;
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
    }
    /**
     *
     * @param id
     */
    getCategoryById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.tableFromSql(this.sqlGetCategoryById, [SALESREGION, id, CHINESE]);
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
            const ret = yield this.tableFromSql(this.sqlGetChildrenCategories, [SALESREGION, parentId, CHINESE]);
            return ret;
        });
    }
    /**
     * 获取根目录节点
     */
    getRootCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.tableFromSql(this.sqlGetRootCategories, [SALESREGION, CHINESE]);
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
            const ret = yield this.tableFromProc(`${this.databaseName}.tv_searchproductbycategory`, [24, 5, pageStart, pageSize, categoryId, SALESREGION, CHINESE]);
            return ret;
        });
    }
}
exports.DbProduct = DbProduct;
//# sourceMappingURL=dbProduct.js.map