import { Db } from "./db";
import { SALESREGION, CHINESE } from "../../tools";

export class DbProduct extends Db {

    private sqlGetCategoryById: string;
    private sqlGetChildrenCategories: string;
    private sqlGetRootCategories: string;
    private sqlSearchProductByCategory: string;
    private sqlSearchProductByKey: string;
    private sqlSearchProductByOrigin: string;

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


        this.sqlSearchProductByOrigin = `
        SELECT  distinct p.id, p.NO, p.brand, p.origin, p.description, p.descriptionc, p.imageurl, pc.chemical
                , pc.cas, pc.purity, pc.molecularfomula, pc.molecularweight, b.name as brandname
        FROM     ${db}.tv_productproductcategorycache as pp
                inner join ${db}.tv_productx as p on p.id = pp.product
                left join ${db}.tv_brand as b on p.$unit = b.$unit and p.brand = b.id
                LEFT join ${db}.tv_productchemical as pc on p.$unit = pc.$unit and p.id = pc.product
        WHERE 	pp.$unit =? AND pp.salesRegion=? 
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

    /**
    * 查询目录节点中包含的产品
    * @param key 关键字
    * @param pageStart 起始页
    * @param pageSize 每页产品个数
    */
    async searchProductByKey(key: string, pageStart: number, pageSize: number) {
        key = '%' + key + '%';
        const ret = await this.tableFromSql(this.sqlSearchProductByKey, [24, 5, key, key, key, key, pageStart, pageSize]);
        return ret;
    }

    /**
     * 根据产品编号查询产品
     * @param key 关键字
     */
    async searchProductByOrigin(key: string[]) {
        let start: string = "  AND p.origin in( ";
        let origin: string = "";
        key.forEach(element => { origin += element + "," });
        origin = origin.substring(0, origin.length - 1);
        origin = origin.replace(/\s*/g, "");
        if (origin.length === 0)
            return [];
        const ret = await this.tableFromSql(this.sqlSearchProductByOrigin + start + origin + ")", [24, 5]);
        return ret;
    }
}
