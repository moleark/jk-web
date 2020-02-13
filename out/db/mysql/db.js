"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbBase_1 = require("./dbBase");
const dbContent_1 = require("./dbContent");
const dbProduct_1 = require("./dbProduct");
class Db {
    static init() {
        dbBase_1.DbBase.init();
        Db.content = new dbContent_1.DbContent();
        Db.product = new dbProduct_1.DbProduct();
    }
}
exports.Db = Db;
Db.unit = 24;
//# sourceMappingURL=db.js.map