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
const mysql_1 = require("mysql");
const config = require("config");
const mysqlConfig = config.get("connection");
const pool = mysql_1.createPool(mysqlConfig);
const databaseName = config.get('database');
function buildCall(proc, values) {
    let ret = 'call `' + databaseName + '`.`' + proc + '`(';
    if (values !== undefined) {
        ret += values.map(v => '?').join(',');
    }
    return ret + ');';
}
function execSql(sql, params) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            pool.query(sql, params, (err, result) => {
                if (err !== null) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    });
}
exports.execSql = execSql;
function tableFromSql(sql, values) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield execSql(sql, values);
        if (Array.isArray(res) === false)
            return [];
        if (res.length === 0)
            return [];
        let row0 = res[0];
        if (Array.isArray(row0))
            return row0;
        return res;
    });
}
exports.tableFromSql = tableFromSql;
function tablesFromSql(sql, values) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield execSql(sql, values);
    });
}
exports.tablesFromSql = tablesFromSql;
function execProc(proc, values) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield new Promise((resolve, reject) => {
            let sql = buildCall(proc, values);
            pool.query(sql, values, (err, result) => {
                if (err !== null) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    });
}
exports.execProc = execProc;
function tableFromProc(proc, values) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield execProc(proc, values);
        if (Array.isArray(res) === false)
            return [];
        switch (res.length) {
            case 0: return [];
            default: return res[0];
        }
    });
}
exports.tableFromProc = tableFromProc;
function tablesFromProc(proc, values) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield execProc(proc, values);
    });
}
exports.tablesFromProc = tablesFromProc;
function buildProcedureSql(proc) {
    let { name, params, label, code, returns } = proc;
    let ret = 'CREATE ';
    ret += returns === undefined ? 'PROCEDURE ' : 'FUNCTION ';
    ret += name + ' (';
    if (params !== undefined)
        ret += params.join(',');
    ret += ')\n';
    if (returns !== undefined)
        ret += "RETURNS " + returns + "\n";
    if (label !== undefined)
        ret += label + ': ';
    ret += 'BEGIN \n';
    ret += code;
    ret += '\nEND\n';
    return ret;
}
exports.buildProcedureSql = buildProcedureSql;
function buildTableSql(tbl) {
    let ret = 'CREATE TABLE IF NOT EXISTS ' + tbl.name + ' (';
    ret += tbl.code.join(',');
    ret += ');\n';
    return ret;
}
exports.buildTableSql = buildTableSql;
//# sourceMappingURL=tool.js.map