import { Db } from './db';

export class DbEPEC extends Db {

    private sqlGetUser: string;
    private sqlSaveLoginReq: string;

    constructor() {
        super('joint-uq-platform');

        let db = this.databaseName;
        this.sqlGetUser = `
            SELECT  webUser, password, username 
            FROM    \`${db}\`.tv_epecuser
            where   username = ?;
        `;

        this.sqlSaveLoginReq = `insert into \`${db}\`.tv_epecloginpending(token, myUsername, password, epecUsername, createtime)
            values(?, ?, ?, ?, now()); `;
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

    /**
     * 
     * @param token 
     * @param webUser 
     * @param password 
     * @param username 
     * @returns 
     */
    async saveLoginReq(token: string, webUser: string, password: string, username: string): Promise<boolean> {
        try {
            await this.execSql(this.sqlSaveLoginReq, [token, webUser, password, username])
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    /**
     * 
     * @param token 
     * @returns 
     */
    async getLoginReq(token: string): Promise<any> {
        const ret = await this.tableFromSql(`select myUsername, password, epecUsername from \`${this.databaseName}\`.tv_epecloginpending where token = ?`, [token]);
        if (ret && ret.length > 0) {
            this.execSql(`delete from \`${this.databaseName}\`.tv_epecloginpending where token = ?;`, [token]);
            return ret[0];
        }
        return undefined;
    }
}