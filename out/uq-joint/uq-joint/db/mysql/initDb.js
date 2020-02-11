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
const database_1 = require("./database");
const tables_1 = require("./tables");
const procs_1 = require("./procs");
const tool_1 = require("./tool");
//import {buildRoot} from './buildRoot';
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        let tbl = yield tool_1.tableFromSql(database_1.existsDatabase);
        let exists = tbl[0];
        if (exists !== undefined) {
            console.log('Database already exists. Nothing to do this time.');
            return;
        }
        console.log('Start init database %s.', database_1.databaseName);
        yield tool_1.execSql(database_1.createDatabase);
        yield tool_1.execSql(database_1.useDatabase);
        console.log('Database %s created.', database_1.databaseName);
        for (let i in tables_1.tableDefs) {
            let tbl = tables_1.tableDefs[i];
            let sql = tool_1.buildTableSql(tbl);
            yield tool_1.execSql(sql).then(v => {
                console.log('succeed: ' + tbl.name);
            }).catch(reason => {
                console.log('error: ' + tbl.name);
                console.log(reason);
            });
        }
        for (let i in procs_1.procDefs) {
            let proc = procs_1.procDefs[i];
            console.log('CREATE PROCEDURE ' + proc.name);
            let sql = tool_1.buildProcedureSql(proc);
            yield tool_1.execSql(sql).then(v => {
            }).catch(reason => {
                console.log(reason);
            });
        }
    });
}
exports.init = init;
//# sourceMappingURL=initDb.js.map