import { Db } from "./db";

export class DbPointShop extends Db {
    private sqlGetPointProductDetail: string;

    constructor() {
        super('pointshop');
        let db = this.databaseName;
        this.sqlGetPointProductDetail = `
            SELECT pointproduct, content 
            FROM ${db}.tv_pointproductdetail
            WHERE pointproduct = ? 
        `;
    }

    async getPointProductDetail(id: any): Promise<any> {
        const ret = await this.tableFromSql(this.sqlGetPointProductDetail, [id]);
        return ret;
    }
}