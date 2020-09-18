import { Db } from "./db";
import { DbContent } from "./dbContent";
import { DbProduct } from "./dbProduct";
import { DbProductIndex } from "./dbProductIndex";
import { DbPointShop } from "./dbPointShop";

export class Dbs {
    static unit = 24;
    static content: DbContent;
    static product: DbProduct;
    static productIndex: DbProductIndex;
    static pointshop: DbPointShop;

    static init() {
        Db.init();
        Dbs.content = new DbContent();
        Dbs.product = new DbProduct();
        Dbs.productIndex = new DbProductIndex();
        Dbs.pointshop = new DbPointShop();
    }
}

export { Db } from './db';
