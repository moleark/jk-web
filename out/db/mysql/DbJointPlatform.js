"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbEPEC = void 0;
const db_1 = require("./db");
class DbEPEC extends db_1.Db {
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
    getUserByName(loginName) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.tableFromSql(this.sqlGetUser, [loginName]);
            if (ret && ret.length > 0)
                return ret[0];
            return undefined;
        });
    }
    /**
     *
     * @param token
     * @param webUser
     * @param password
     * @param username
     * @returns
     */
    saveLoginReq(token, webUser, password, username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.execSql(this.sqlSaveLoginReq, [token, webUser, password, username]);
                return true;
            }
            catch (error) {
                console.error(error);
                return false;
            }
        });
    }
    /**
     *
     * @param token
     * @returns
     */
    getLoginReq(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.tableFromSql(`select myUsername, password, epecUsername from \`${this.databaseName}\`.tv_epecloginpending where token = ?`, [token]);
            if (ret && ret.length > 0) {
                this.execSql(`delete from \`${this.databaseName}\`.tv_epecloginpending where token = ?;`, [token]);
                return ret[0];
            }
            return undefined;
        });
    }
}
exports.DbEPEC = DbEPEC;
//# sourceMappingURL=DbJointPlatform.js.map