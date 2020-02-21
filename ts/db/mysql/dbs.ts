import { Db } from "./db";
import { DbContent } from "./dbContent";
import { DbProduct } from "./dbProduct";

export class Dbs {
    static unit = 24;
    static content: DbContent;
    static product: DbProduct;
    
    static init() {
        Db.init();
        Dbs.content = new DbContent();
        Dbs.product = new DbProduct();
    }
}

export { Db } from './db';