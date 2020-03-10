import { Db } from "./db";

export class DbProductIndex extends Db {
    private sqlCASInterval: string;
    private sqlGetCASByInterval: string;

    constructor() {
        super('productIndex');
        let db = this.databaseName;
        this.sqlCASInterval = `
            SELECT id, start, end 
            FROM ${db}.tv_casinterval
            ORDER BY id
        `;

        this.sqlGetCASByInterval = `
            SELECT a.content, a.caption
            FROM ${db}.tv_allcas
            WHERE casinterval = ?;
        `;
    }

    async CASInterval(): Promise<any> {
        const ret = await this.tableFromSql(this.sqlCASInterval);
        return ret;
    }

    async getCASByInterval(id: any): Promise<any> {
        const ret = await this.tableFromSql(this.sqlGetCASByInterval, [id]);
        return ret;
    }
}
