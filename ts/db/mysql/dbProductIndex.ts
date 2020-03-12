import { Db } from "./db";

export class DbProductIndex extends Db {
    private sqlCASInterval: string;
    private sqlGetCASByInterval: string;

    private sqlGetSortNameIntervalGroup: string;
    private sqlSortNameInterval: string;
    private sqlGetProductBySortNameInterval: string;

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
    async CASInterval(salesRegionId: number): Promise<any> {
        const ret = await this.tableFromSql(this.sqlCASInterval, [salesRegionId]);
        return ret;
    }

    /**
     * 获取某销售区域的某CAS区间中包含的CAS列表
     * @param salesRegionId 
     * @param casInervalId 
     */
    async getCASByInterval(salesRegionId: number, casInervalId: number): Promise<any> {
        const ret = await this.tableFromSql(this.sqlGetCASByInterval, [salesRegionId, casInervalId]);
        return ret;
    }

    /**
     * 获取某销售区域的SortName区间分组
     * @param salesRegionId 
     */
    async getSortNameIntervalGroup(salesRegionId: number): Promise<any> {
        const ret = await this.tableFromSql(this.sqlGetSortNameIntervalGroup, [salesRegionId]);
        return ret;
    }

    /**
     * 获取某销售区域的SortName区间设置
     * @param salesRegionId 
     */
    async SortNameInterval(salesRegionId: number, groupId: number): Promise<any> {
        const ret = await this.tableFromSql(this.sqlSortNameInterval, [salesRegionId, groupId]);
        return ret;
    }

    /*
    async getProductBySortNameInterval(salesRegionId: number, sortNameIntervalId: number): Promise<any> {
        const ret = await this.tableFromSql(this.sqlGetProductBySortNameInterval, [salesRegionId, sortNameIntervalId]);
        return ret;
    }
    */
}
