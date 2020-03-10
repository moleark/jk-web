"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const dbContent_1 = require("./dbContent");
const dbProduct_1 = require("./dbProduct");
const dbProductIndex_1 = require("./dbProductIndex");
class Dbs {
    static init() {
        db_1.Db.init();
        Dbs.content = new dbContent_1.DbContent();
        Dbs.product = new dbProduct_1.DbProduct();
        Dbs.productIndex = new dbProductIndex_1.DbProductIndex();
    }
}
exports.Dbs = Dbs;
Dbs.unit = 24;
var db_2 = require("./db");
exports.Db = db_2.Db;
//# sourceMappingURL=dbs.js.map