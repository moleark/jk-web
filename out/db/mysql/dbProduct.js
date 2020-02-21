"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
class DbProduct extends db_1.Db {
    constructor() {
        super('product');
    }
}
exports.DbProduct = DbProduct;
//# sourceMappingURL=dbProduct.js.map