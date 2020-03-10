import { Db } from "./db";
import { DbContent } from "./dbContent";
import { DbProduct } from "./dbProduct";
import { DbProductIndex } from "./dbProductIndex";

export class Dbs {
    static unit = 24;
    static content: DbContent;
    static product: DbProduct;
    static productIndex: DbProductIndex;

    static init() {
        Db.init();
        Dbs.content = new DbContent();
        Dbs.product = new DbProduct();
        Dbs.productIndex = new DbProductIndex();
    }
}

export { Db } from './db';
