import { Db } from './db';

export class DbEPEC extends Db {

    private sqlGetUser: string;

    constructor() {
        super('joint-uq-platform');

        let db = this.databaseName;
        this.sqlGetUser = `
            SELECT   
            FROM    ${db}.tv_epecUser
            where   sh.$unit = 24 and sh.name = ?;
        `;
    }

    /**
     * 获取
     * @param loginName
     */
    async getUserByName(loginName: string): Promise<any> {
        const ret = await this.tableFromSql(this.sqlGetUser, [loginName]);
        if (ret && ret.length > 0)
            return ret[0];
        return undefined;
    }
}