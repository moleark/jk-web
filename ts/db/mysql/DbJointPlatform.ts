import { epecLogger } from '../../epec/logger';
import { Db } from './db';

export class DbJointPlatform extends Db {

    private sqlGetEpecUser: string;
    private sqlGetUserByLoginKey: string;
    private sqlSaveLoginReq: string;
    private sqlSaveapirawcontent: string;
    private sqlSavePunchOutRequest: string;

    constructor() {
        super('joint-uq-platform');

        let db = this.databaseName;
        this.sqlGetEpecUser = `
            SELECT  webUser, password, username 
            FROM    \`${db}\`.tv_epecuser
            where   username = ?;
        `;

        this.sqlSaveLoginReq = `insert into \`${db}\`.tv_epecloginpending(token, myUsername, password, epecUsername, createtime)
            values(?, ?, ?, ?, now()); `;

        this.sqlGetUserByLoginKey = `select webUser, username, password, organization, team 
            from \`${db}\`.tv_neotridentuser
            where sharedSecret = ?`;

        this.sqlSaveapirawcontent = `INSERT INTO \`${db}\`.tv_apirawcontent(platform, api, content)
            VALUES(?, ?, ?)`;

        this.sqlSavePunchOutRequest = `INSERT INTO \`${db}\`.tv_punchoutsetuprequest(platform, body, fromdomain, fromidentity, todomain,
            toidentity, senderdomain, senderidentity, senderuseragent, sendersharedsecret, browserformposturl, buyercookie, payloadid)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    }

    /**
     * 获取
     * @param loginName
     */
    async getUserByName(loginName: string): Promise<any> {
        const ret = await this.tableFromSql(this.sqlGetEpecUser, [loginName]);
        if (ret && ret.length > 0)
            return ret[0];
        return undefined;
    }

    /**
     * 
     * @param key 
     * @returns 
     */
    async getUserByLoginKey(key: string): Promise<any> {
        const ret = await this.tableFromSql(this.sqlGetUserByLoginKey, [key]);
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
            epecLogger.error(error);
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

    /**
     * 诺华保存源数据
     * @param platform 
     * @param apiName 
     * @param content 
     * @param payloadID 
     */
    async saveApirawContent(platform: number, apiName: string, content: any): Promise<any> {

        try {
            await this.execSql(this.sqlSaveapirawcontent, [platform, apiName, content])
        } catch (error) {
            throw error;
        }
    }

    async savePunchOutSetupRequest(platform: number, jsonObj: any, xmlBody: any): Promise<any> {
        let { payloadID, Header: punchoutHeader, Request: punchoutRequest } = jsonObj.cXML;
        try {

            await this.execSql(this.sqlSavePunchOutRequest, [platform, xmlBody, punchoutHeader.From.Credential.domain, punchoutHeader.From.Credential.Identity, punchoutHeader.To.Credential.domain, punchoutHeader.To.Credential.Identity, punchoutHeader.Sender.Credential.domain, punchoutHeader.Sender.Credential.Identity, punchoutHeader.Sender.UserAgent, punchoutHeader.Sender.Credential.SharedSecret, punchoutRequest.BrowserFormPost.URL, punchoutRequest.PunchOutSetupRequest.BuyerCookie, payloadID])
        } catch (error) {
            throw error;
        }
    }
}