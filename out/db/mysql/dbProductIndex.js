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
const db_1 = require("./db");
class DbProductIndex extends db_1.Db {
    constructor() {
        super('productIndex');
        let db = this.databaseName;
        this.sqlCASInterval = `
            SELECT id, start, end 
            FROM ${db}.tv_casinterval
            ORDER BY id
        `;
        this.sqlGetCASByInterval = `
            SELECT a.content, a.caption
            FROM ${db}.tv_allcas
            WHERE casinterval = ?;
        `;
    }
    CASInterval() {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.tableFromSql(this.sqlCASInterval);
            return ret;
        });
    }
    getCASByInterval(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.tableFromSql(this.sqlGetCASByInterval, [id]);
            return ret;
        });
    }
}
exports.DbProductIndex = DbProductIndex;
//# sourceMappingURL=dbProductIndex.js.map