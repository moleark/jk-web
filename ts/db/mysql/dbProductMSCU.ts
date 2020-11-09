import { Db } from './db';

export class DbProductMSCU extends Db {

    private sqlGetProductMsdsFile: string;
    private sqlGetProductVersions: string;

    private sqlGetProductSpecFile: string;

    constructor() {
        super('product');

        let db = this.databaseName;
        this.sqlGetProductMsdsFile = `
            SELECT  pm.product, pm.language, pm.filename
            FROM    ${db}.tv_productmsdsfile as pm
            where   pm.$unit = 24 and pm.product = ? and pm.language = ?;
        `;

        this.sqlGetProductVersions = `
            select  pm.language, pm.filename, p.origin
            FROM    ${db}.tv_productmsdsfile as pm
                    inner join ${db}.tv_productx as p on p.$unit = pm.$unit and p.id = pm.product
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
    async getProductMsds(productId: any, langId: any): Promise<any> {
        let param = [productId, langId];
        const ret = await this.tableFromSql(this.sqlGetProductMsdsFile, param);
        if (ret && ret.length > 0)
            return ret[0];
        return undefined;
    }


    /**
     * 
     * @param jkOrigin 
     */
    async getProductMsdsVersions(jkOrigin: string): Promise<any> {
        const ret = await this.tableFromSql(this.sqlGetProductVersions, [jkOrigin]);
        if (ret && ret.length > 0)
            return ret;
        return undefined;
    }


    /**
     * 根据主键获取指定产品的Spec文件 
     * @param productId productId
     */
    async getProductSpec(productId: any): Promise<any> {
        const ret = await this.tableFromSql(this.sqlGetProductSpecFile, productId);
        if (ret && ret.length > 0)
            return ret[0];
        return undefined;
    }
}