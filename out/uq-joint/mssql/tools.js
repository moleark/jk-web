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
const mssql = require("mssql");
const connection_1 = require("./connection");
let __pool;
function initMssqlPool() {
    return __awaiter(this, void 0, void 0, function* () {
        __pool = yield new mssql.ConnectionPool(connection_1.conn).connect();
    });
}
exports.initMssqlPool = initMssqlPool;
/*
async function getPool() {
    if (__pool === undefined) {
        return __pool = await new mssql.ConnectionPool(conn).connect();
    }
    else {
        return __pool;
    }

}
*/
function execSql(sql, params) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const request = __pool.request();
            if (params !== undefined) {
                for (let p of params) {
                    let { name, value } = p;
                    request.input(name, value);
                }
            }
            const result = yield request.query(sql);
            return result;
        }
        catch (error) {
            // debugger;
            console.error(error);
            throw error;
        }
    });
}
exports.execSql = execSql;
;
//# sourceMappingURL=tools.js.map