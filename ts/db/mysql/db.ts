import { DbBase } from "./dbBase";
import { DbContent } from "./dbContent";
import { DbProduct } from "./dbProduct";

export class Db {
    static unit = 24;
    static content: DbContent;
    static product: DbProduct;
    
    static init() {
        DbBase.init();
        Db.content = new DbContent();
        Db.product = new DbProduct();
    }
}
