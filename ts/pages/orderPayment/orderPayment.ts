import { Request, Response } from "express";
import { Dbs } from "../../db";
import { aliPay } from "./aliPay";
import { wxPay } from "./wxPay";

export async function orderPayment(req: Request, res: Response, next: any) {
    let { payid, appid, orderid } = req.params;
    // orderid = '190814000002'; //201118000001  201119000001 190814000001 190814000002
    // payid = 'alipay';
    const order = await Dbs.orderPayment.getOrderByOrderId(orderid);
    if (order) {
        let result;
        if (payid === 'wxpay') result = await wxPay(order);
        if (payid === 'alipay') result = await aliPay(order);
        if (result) res.send(result);
        res.status(404).end();
    } else
        res.status(404).end();
};