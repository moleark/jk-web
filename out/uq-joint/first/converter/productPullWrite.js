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
const _ = require("lodash");
const product_1 = require("../../settings/in/product");
const tools_1 = require("../../mssql/tools");
const productCategory_1 = require("../../settings/in/productCategory");
function productPullWrite(joint, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // await joint.uqIn(Product, _.pick(data, ["ID", "BrandID", "ProductNumber", "Description", "DescriptionC"]));
            yield joint.uqIn(product_1.ProductX, _.pick(data, ["ID", "ProductID", "BrandID", "ProductNumber", "Description", "DescriptionC", "IsValid"]));
            yield joint.uqIn(product_1.ProductChemical, _.pick(data, ["ProductID", "ChemicalID", "Purity", "CAS", "MolecularFomula", "MolecularWeight"]));
            return true;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    });
}
exports.productPullWrite = productPullWrite;
function productFirstPullWrite(joint, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield joint.uqIn(product_1.ProductX, _.pick(data, ["ID", "ProductID", "BrandID", "ProductNumber", "Description", "DescriptionC", "IsValid"]));
            let promises = [];
            promises.push(joint.uqIn(product_1.ProductChemical, _.pick(data, ["ProductID", "ChemicalID", "Purity", "CAS", "MolecularFomula", "MolecularWeight"])));
            let productId = data["ProductID"];
            let promisesSql = [];
            let packsql = `
            select  j.jkcat as ID, j.jkcat as PackingID, j.jkid as ProductID, j.PackNr, j.Quantity, j.Unit as Name
                    from zcl_mess.dbo.jkcat j
                    where j.jkid = @ProductID and j.unit in ( select unitE from opdata.dbo.supplierPackingUnit )
                    order by j.jkcat`;
            promisesSql.push(tools_1.execSql(packsql, [{ 'name': 'ProductID', 'value': productId }]));
            let readProductSalesRegion = `
            select ExCID as ID, jkid as ProductID, market_code as SalesRegionID, IsValid
                from zcl_mess.dbo.ProductsLocation where jkid = @ProductID`;
            promisesSql.push(tools_1.execSql(readProductSalesRegion, [{ 'name': 'ProductID', 'value': productId }]));
            let readProductLegallyProhibited = `
            select jkid + market_code as ID, jkid as ProductID, market_code as SalesRegionID, left(description, 20) as Reason
                from zcl_mess.dbo.sc_safe_ProdCache where jkid = @ProductID`;
            promisesSql.push(tools_1.execSql(readProductLegallyProhibited, [{ 'name': 'ProductID', 'value': productId }]));
            let readProductProductCategory = `
            select ID, ID as SaleProductProductCategoryID, SaleProductID, ProductCategoryID, IsValid
                    from opdata.dbo.SaleProductProductCategory where SaleProductID = @ProductID order by ID`;
            promisesSql.push(tools_1.execSql(readProductProductCategory, [{ 'name': 'ProductID', 'value': productId }]));
            let sqlResult = yield Promise.all(promisesSql);
            promises.push(pushRecordset(joint, sqlResult[0], product_1.ProductPackX));
            promises.push(pushRecordset(joint, sqlResult[1], product_1.ProductSalesRegion));
            promises.push(pushRecordset(joint, sqlResult[2], product_1.ProductLegallyProhibited));
            promises.push(pushRecordset(joint, sqlResult[3], productCategory_1.ProductProductCategory));
            yield Promise.all(promises);
            return true;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    });
}
exports.productFirstPullWrite = productFirstPullWrite;
function packFirstPullWrite(joint, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield joint.uqIn(product_1.ProductPackX, data);
            let packId = data["PackingID"];
            let pricesql = `
            select jp.ExCID as ID, jp.jkcat as PackingID, j.jkid as ProductID
                    , jp.market_code as SalesRegionID, jp.Price, jp.Currency, jp.Expire_Date, JP.Discontinued
                    from zcl_mess.dbo.jkcat_price jp inner join zcl_mess.dbo.jkcat j on jp.jkcat = j.jkcat
                    where jp.jkcat = @PackingID`;
            let priceResult = yield tools_1.execSql(pricesql, [{ 'name': 'PackingID', 'value': packId }]);
            yield pushRecordset(joint, priceResult, product_1.PriceX);
            return true;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    });
}
exports.packFirstPullWrite = packFirstPullWrite;
function pushRecordset(joint, result, uqIn) {
    if (result !== undefined) {
        let { recordset } = result;
        let { firstPullWrite, pullWrite } = uqIn;
        let promises = [];
        for (var i = 0; i < recordset.length; i++) {
            let row = recordset[i];
            if (firstPullWrite) {
                promises.push(firstPullWrite(joint, row));
                // await firstPullWrite(joint, row);
            }
            else if (pullWrite) {
                promises.push(pullWrite(joint, row));
                // await pullWrite(joint, row);
            }
            else {
                promises.push(joint.uqIn(uqIn, row));
                // await joint.uqIn(uqIn, row);
            }
        }
        return Promise.all(promises);
    }
}
exports.pushRecordset = pushRecordset;
//# sourceMappingURL=productPullWrite.js.map