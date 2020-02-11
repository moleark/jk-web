"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const uqOutRead_1 = require("../../first/converter/uqOutRead");
const productInventoryPull = (joint, uqBus, queue) => __awaiter(void 0, void 0, void 0, function* () {
    let sql = `select top 1 wi.ID, wi.WarehouseID, j.jkid as ProductID, wi.PackagingID as PackingID, wi.Inventory
        from ProdData.dbo.Export_WarehouseInventory wi inner join zcl_mess.dbo.jkcat j on wi.PackagingID = j.jkcat
        where wi.ID > @iMaxId order by wi.ID`;
    return yield uqOutRead_1.uqOutRead(sql, queue);
});
exports.faceProductInventory = {
    face: '百灵威系统工程部/point/productInventory',
    mapper: {
        warehouse: 'WarehouseID@Warehouse',
        product: 'ProductID@ProductX',
        pack: 'PackingID@ProductX_PackX',
        quantity: 'Inventory',
    },
    pull: productInventoryPull,
};
//# sourceMappingURL=productInventoryBus.js.map