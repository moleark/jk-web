import { Db } from "./db";

const SALESREGION = 1;
const CHINESE = 197;

export class DbProduct extends Db {

    private sqlGetCategoryById: string;
    private sqlGetChildrenCategories: string;
    private sqlGetRootCategories: string;

    constructor() {
        super('product');

        let db = this.databaseName;
        this.sqlGetCategoryById = `
            SELECT  pc.id, pc.no, pc.parent, pc.isLeaf, pc.orderWithinParent, pcl.name
            FROM    ${db}.tv_ProductCategory pc
                    inner join ${db}.tv_ProductCategory_ProductCategoryLanguage pcl on pcl.owner = pc.id
                    inner join ${db}.tv_ProductCategoryInclusion as ppi on ppi.category = pc.id and ppi.salesregion = ? and ppi.total > 0
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
        `
    }

    async getCategoryById(id: number): Promise<any> {
        const ret = await this.tableFromSql(this.sqlGetCategoryById, [SALESREGION, id, CHINESE]);
        return ret;
    }

    async getChildrenCategories(parentId: number): Promise<any> {
        const ret = await this.tableFromSql(this.sqlGetChildrenCategories, [SALESREGION, parentId, CHINESE]);
        return ret;
    }

    async getRootCategories(): Promise<any> {
        const ret = await this.tableFromSql(this.sqlGetRootCategories, [SALESREGION, CHINESE]);
        return ret;
    }
}
