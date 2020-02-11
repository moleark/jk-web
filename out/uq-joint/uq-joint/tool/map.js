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
const tool_1 = require("../db/mysql/tool");
const database_1 = require("../db/mysql/database");
const createMapTable_1 = require("./createMapTable");
function map(moniker, id, no) {
    return __awaiter(this, void 0, void 0, function* () {
        let sql = `
        insert into \`${database_1.databaseName}\`.\`map_${moniker}\` (id, no) values (${id}, '${no}') 
        on duplicate key update id=${id};
    `;
        try {
            yield tool_1.execSql(sql);
        }
        catch (err) {
            yield createMapTable_1.createMapTable(moniker);
            yield tool_1.execSql(sql);
        }
    });
}
exports.map = map;
//# sourceMappingURL=map.js.map