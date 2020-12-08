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
exports.orderPayment = void 0;
const db_1 = require("../../db");
const aliPay_1 = require("./aliPay");
const wxPay_1 = require("./wxPay");
function orderPayment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let { payid, appid, orderid } = req.params;
        // orderid = '190814000002'; //201118000001  201119000001 190814000001 190814000002
        // payid = 'alipay';
        const order = yield db_1.Dbs.orderPayment.getOrderByOrderId(orderid);
        if (order) {
            let result;
            if (payid === 'wxpay')
                result = yield wxPay_1.wxPay(order);
            if (payid === 'alipay')
                result = yield aliPay_1.aliPay(order);
            if (result)
                res.send(result);
            res.status(404).end();
        }
        else
            res.status(404).end();
    });
}
exports.orderPayment = orderPayment;
;
//# sourceMappingURL=orderPayment.js.map