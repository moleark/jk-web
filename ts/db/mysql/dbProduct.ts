import { Db } from "./db";

const SALESREGION = 1;
const CHINESE = 197;

export class DbProduct extends Db {

    private sqlGetCategoryById: string;
    private sqlGetChildrenCategories: string;
    private sqlGetRootCategories: string;
    private sqlSearchProductByCategory: string;

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
    }

    /**
     *
     * @param id
     */
    async getCategoryById(id: number): Promise<any> {
        const ret = await this.tableFromSql(this.sqlGetCategoryById, [SALESREGION, id, CHINESE]);
        if (ret && ret.length > 0)
            return ret[0];
        return undefined;
    }

    /**
     * 获取目录节点的所有子节点
     * @param parentId
     */
    async getChildrenCategories(parentId: number): Promise<any> {
        const ret = await this.tableFromSql(this.sqlGetChildrenCategories, [SALESREGION, parentId, CHINESE]);
        return ret;
    }

    /**
     * 获取根目录节点
     */
    async getRootCategories(): Promise<any> {
        const ret = await this.tableFromSql(this.sqlGetRootCategories, [SALESREGION, CHINESE]);
        return ret;
    }

    /**
   * 查询目录节点中包含的产品
   * @param categoryId 目录节点id
   * @param pageStart 起始页
   * @param pageSize 每页产品个数
   */
    async searchProductByCategory(categoryId: number, pageStart: number, pageSize: number) {
        const ret = await this.tableFromSql(this.sqlSearchProductByCategory, [24, 5, categoryId, pageStart, pageSize]);
        return ret;
    }
}
