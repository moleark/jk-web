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
const tools_1 = require("../../mssql/tools");
function uqOutRead(sql, maxId) {
    return __awaiter(this, void 0, void 0, function* () {
        // let iMaxId = maxId === "" ? 0 : Number(maxId);
        return yield readMany(sql, [{ name: 'iMaxId', value: maxId }]);
    });
}
exports.uqOutRead = uqOutRead;
function uqPullRead(sql, queue) {
    return __awaiter(this, void 0, void 0, function* () {
        let ret = yield readOne(sql, [{ name: 'iMaxId', value: queue }]);
        if (ret !== undefined)
            return { queue: Number(ret.lastId), data: ret.data };
    });
}
exports.uqPullRead = uqPullRead;
const readOne = (sqlstring, params) => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield tools_1.execSql(sqlstring, params);
    let { recordset } = result;
    if (recordset.length === 0)
        return;
    let prod = recordset[0];
    return { lastId: prod.ID, data: prod };
});
/**
 *
 * @param sqlstring 要执行的存储过程
 * @param params
 * @returns 对象: lastId: 多个结果中最大的id值；data: 是个对象的数组，数组中的对象属性即字段名，值即字段值
 */
function readMany(sqlstring, params) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield tools_1.execSql(sqlstring, params);
        let { recordset } = result;
        let rows = recordset.length;
        if (rows === 0)
            return;
        return { lastPointer: recordset[rows - 1].ID, data: recordset };
    });
}
exports.readMany = readMany;
//# sourceMappingURL=uqOutRead.js.map