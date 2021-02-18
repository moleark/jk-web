"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dbs = void 0;
const db_1 = require("./db");
const dbContent_1 = require("./dbContent");
const dbProduct_1 = require("./dbProduct");
const dbProductIndex_1 = require("./dbProductIndex");
const dbPointShop_1 = require("./dbPointShop");
const dbProductMSCU_1 = require("./dbProductMSCU");
const DbOrderPayment_1 = require("./DbOrderPayment");
const DbJointPlatform_1 = require("./DbJointPlatform");
class Dbs {
    static init() {
        db_1.Db.init();
        Dbs.content = new dbContent_1.DbContent();
        Dbs.product = new dbProduct_1.DbProduct();
        Dbs.productIndex = new dbProductIndex_1.DbProductIndex();
        Dbs.pointshop = new dbPointShop_1.DbPointShop();
        Dbs.productMSCU = new dbProductMSCU_1.DbProductMSCU();
        Dbs.orderPayment = new DbOrderPayment_1.DbOrderPayment();
        Dbs.jointPlatform = new DbJointPlatform_1.DbEPEC();
    }
}
exports.Dbs = Dbs;
Dbs.unit = 24;
var db_2 = require("./db");
Object.defineProperty(exports, "Db", { enumerable: true, get: function () { return db_2.Db; } });
//# sourceMappingURL=dbs.js.map