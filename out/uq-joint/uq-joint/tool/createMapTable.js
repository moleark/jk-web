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
const database_1 = require("../db/mysql/database");
const tool_1 = require("../db/mysql/tool");
function createMapTable(moniker) {
    return __awaiter(this, void 0, void 0, function* () {
        let sql = `
    create table if not exists \`${database_1.databaseName}\`.\`map_${moniker}\` (
        id bigint not null,
        no varchar(50) not null,
        primary key(id),
        unique index no_idx(no)
    );
    `;
        yield tool_1.execSql(sql);
    });
}
exports.createMapTable = createMapTable;
//# sourceMappingURL=createMapTable.js.map