import { Db } from "./db";
import { SALESREGION } from "../../tools";

export class DbProductIndex extends Db {
    private sqlCASInterval: string;
    private sqlGetCASByInterval: string;

    constructor() {
        super('productIndex');
        let db = this.databaseName;
        this.sqlCASInterval = `
            SELECT id, start, end 
            FROM ${db}.tv_casinterval
            WHERE salesregion = ${SALESREGION}
            ORDER BY id;
        `;

        this.sqlGetCASByInterval = `
            SELECT  cas 
            FROM ${db}.tv_casinsalesregion
            WHERE salesregion = ${SALESREGION} and casinterval = ?
            ORDER BY cas;
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
