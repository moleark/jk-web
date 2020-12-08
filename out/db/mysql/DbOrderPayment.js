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
exports.DbOrderPayment = void 0;
const db_1 = require("./db");
class DbOrderPayment extends db_1.Db {
    constructor() {
        super('order');
        let db = this.databaseName;
        this.sqlGetOrder = `
            SELECT  ht.webuser,ht.product, ht.pack, ht.amount, sh.id, sh.no, sh.date, sh.discription, sh.processing, sh.version, sh.flow
            FROM    ${db}.tv_orderhistory as ht
                    inner join ${db}.tv_$sheet as sh on sh.$unit = ht.$unit and sh.id = ht.sheet
            where   sh.$unit = 24 and sh.no = ?;
        `;
    }
    /**
     * 获取orderId获取订单信息
     * @param orderId
     */
    getOrderByOrderId(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.tableFromSql(this.sqlGetOrder, [orderId]);
            if (ret && ret.length > 0)
                return ret[0];
            return undefined;
        });
    }
}
exports.DbOrderPayment = DbOrderPayment;
//# sourceMappingURL=DbOrderPayment.js.map