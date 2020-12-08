import { Db } from './db';
import * as config from 'config';

export class DbOrderPayment extends Db {

    private sqlGetOrder: string;

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
    async getOrderByOrderId(orderId: string): Promise<any> {
        const ret = await this.tableFromSql(this.sqlGetOrder, [orderId]);
        if (ret && ret.length > 0)
            return ret[0];
        return undefined;
    }
}