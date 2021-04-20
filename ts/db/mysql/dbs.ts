import { Db } from "./db";
import { DbContent } from "./dbContent";
import { DbProduct } from "./dbProduct";
import { DbProductIndex } from "./dbProductIndex";
import { DbPointShop } from "./dbPointShop";
import { DbProductMSCU } from "./dbProductMSCU";
import { DbOrderPayment } from "./DbOrderPayment";
import { DbJointPlatform } from "./DbJointPlatform";

export class Dbs {
    static unit = 24;
    static content: DbContent;
    static product: DbProduct;
    static productIndex: DbProductIndex;
    static pointshop: DbPointShop;
    static productMSCU: DbProductMSCU;
    static orderPayment: DbOrderPayment;
    static jointPlatform: DbJointPlatform;


    static init() {
        Db.init();
        Dbs.content = new DbContent();
        Dbs.product = new DbProduct();
        Dbs.productIndex = new DbProductIndex();
        Dbs.pointshop = new DbPointShop();
        Dbs.productMSCU = new DbProductMSCU();
        Dbs.orderPayment = new DbOrderPayment();
        Dbs.jointPlatform = new DbJointPlatform();
    }
}

export { Db } from './db';
