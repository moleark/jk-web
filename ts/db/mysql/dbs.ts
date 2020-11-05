import { Db } from "./db";
import { DbContent } from "./dbContent";
import { DbProduct } from "./dbProduct";
import { DbProductIndex } from "./dbProductIndex";
import { DbPointShop } from "./dbPointShop";
import { DbProductMSCU } from "./dbProductMSCU";

export class Dbs {
    static unit = 24;
    static content: DbContent;
    static product: DbProduct;
    static productIndex: DbProductIndex;
    static pointshop: DbPointShop;
    static productMSCU: DbProductMSCU;

    static init() {
        Db.init();
        Dbs.content = new DbContent();
        Dbs.product = new DbProduct();
        Dbs.productIndex = new DbProductIndex();
        Dbs.pointshop = new DbPointShop();
        Dbs.productMSCU = new DbProductMSCU();
    }
}

export { Db } from './db';
