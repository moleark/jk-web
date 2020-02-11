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
const uqs_1 = require("../uqs");
const productPullWrite_1 = require("../../first/converter/productPullWrite");
const tools_1 = require("../../mssql/tools");
const config_1 = require("config");
const promiseSize = config_1.default.get("promiseSize");
exports.Brand = {
    uq: uqs_1.uqs.jkProduct,
    type: 'tuid',
    entity: 'Brand',
    key: 'BrandID',
    mapper: {
        $id: 'BrandID@Brand',
        no: "BrandID",
        name: "BrandName",
    },
    pull: `select top ${promiseSize} ID, BrandID, BrandName
        from ProdData.dbo.Export_Brand where ID > @iMaxId order by ID`,
    firstPullWrite: (joint, data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            joint.uqIn(exports.Brand, data);
            let brandId = data['BrandID'];
            let promisesSql = [];
            let brandSalesRegionSql = `
                select ExcID as ID, code as BrandID, market_code as SalesRegionID, yesorno as Level
                        from zcl_mess.dbo.manufactoryMarket where code = @BrandID`;
            promisesSql.push(tools_1.execSql(brandSalesRegionSql, [{ 'name': 'BrandID', 'value': brandId }]));
            let readBrandDeliveryTime = `
                select ID, BrandCode as BrandID, SaleRegionID as SalesRegionID, MinValue, MaxValue, Unit
                        , case [Restrict] when 'NoRestrict' then 0 else 1 end as [Restrict]
                        from zcl_mess.dbo.BrandDeliverTime where BrandCode = @BrandID and isValid = 1`;
            promisesSql.push(tools_1.execSql(readBrandDeliveryTime, [{ 'name': 'BrandID', 'value': brandId }]));
            let sqlResult = [];
            try {
                sqlResult = yield Promise.all(promisesSql);
            }
            catch (error) {
                console.error(error);
                throw error;
            }
            let promises = [];
            promises.push(productPullWrite_1.pushRecordset(joint, sqlResult[0], exports.BrandSalesRegion));
            promises.push(productPullWrite_1.pushRecordset(joint, sqlResult[1], exports.BrandDeliveryTime));
            yield Promise.all(promises);
            return true;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    })
};
exports.BrandSalesRegion = {
    uq: uqs_1.uqs.jkProduct,
    type: 'map',
    entity: 'BrandSalesRegion',
    mapper: {
        brand: "BrandID@Brand",
        arr1: {
            salesRegion: "^SalesRegionID@SalesRegion",
            level: "^Level",
        }
    },
    pull: `select top ${promiseSize} ID, BrandID, SalesRegionID, BrandLevel as Level
        from ProdData.dbo.Export_BrandSalesRegion where ID > @iMaxId order by ID`,
};
exports.BrandDeliveryTime = {
    uq: uqs_1.uqs.jkProduct,
    type: 'map',
    entity: 'BrandDeliveryTime',
    mapper: {
        brand: "BrandID@Brand",
        arr1: {
            salesRegion: "^SalesRegionID@SalesRegion",
            minValue: "^MinValue",
            maxValue: "^MaxValue",
            unit: '^Unit',
            // deliveryTimeDescription: "^DeliveryTimeDescription",
            isRestrict: '^Restrict',
        }
    },
    pull: `select top ${promiseSize} ID, BrandCode as BrandID, SaleRegionID as SalesRegionID, MinValue, MaxValue, Unit
        , case [Restrict] when 'NoRestrict' then 0 else 1 end as [Restrict]
        from ProdData.dbo.Export_BrandDeliverTime where id > @iMaxId and isValid = 1 order by id`,
};
/*
export const Product: UqInTuid = {
    uq: uqs.jkProduct,
    type: 'tuid',
    entity: 'Product',
    key: 'ProductID',
    mapper: {
        $id: 'ProductID@Product',
        no: "ProductID",
        brand: "BrandID@Brand",
        origin: "ProductNumber",
        description: 'Description',
        descriptionC: 'DescriptionC',
    }
};
*/
exports.ProductX = {
    uq: uqs_1.uqs.jkProduct,
    type: 'tuid',
    entity: 'ProductX',
    key: 'ProductID',
    mapper: {
        $id: 'ProductID@ProductX',
        no: 'ProductID',
        brand: 'BrandID@Brand',
        origin: 'ProductNumber',
        description: 'Description',
        descriptionC: 'DescriptionC',
        isValid: 'IsValid',
    },
    pull: `select top ${promiseSize} ID, ProductID, BrandID, ProductNumber, Description, DescriptionC, CasNumber as CAS, ChemicalID
        , MolecularFormula, MolecularWeight, Purity, Grade, MdlNumber, [Restrict], 1 as IsValid
        from ProdData.dbo.Export_Product where ID > @iMaxId order by ID`,
    pullWrite: productPullWrite_1.productPullWrite,
    firstPullWrite: productPullWrite_1.productFirstPullWrite,
};
exports.InvalidProduct = {
    uq: uqs_1.uqs.jkProduct,
    type: 'tuid',
    entity: 'InvalidProduct',
    key: 'ProductID',
    mapper: {},
    pull: `select top ${promiseSize} pv.ID, pv.ProductID, p.manufactory as BrandID, p.originalId as ProductNumber, p.Description, p.DescriptionC
        , zcl_mess.dbo.fc_recas(p.CAS) as CAS, pc.ChemID as ChemicalID
        , p.mf as MolecularFormula, p.mw as MolecularWeight, p.Purity, p.LotNumber as MdlNumber, p.[Restrict], 0 as IsValid
        from ProdData.dbo.Export_Invalid_Product pv inner join zcl_mess.dbo.Products p on pv.ProductID = p.jkid
        inner join zcl_mess.dbo.ProductsChem pc on pc.jkid = p.jkid
        where pv.ID > @iMaxId order by pv.ID`,
    pullWrite: productPullWrite_1.productPullWrite,
};
exports.ProductPackX = {
    uq: uqs_1.uqs.jkProduct,
    type: 'tuid-arr',
    entity: 'ProductX_PackX',
    key: "PackingID",
    owner: "ProductID",
    mapper: {
        //owner: "ProductID",
        $id: "PackingID@ProductX_PackX",
        jkcat: 'PackingID',
        radiox: "PackNr",
        radioy: "Quantity",
        unit: "Name",
    },
    pull: `select top ${promiseSize} ID, PackagingID as PackingID, ProductID, PackagingQuantity as PackNr, PackagingVolume as Quantity, PackagingUnit as Name
        from ProdData.dbo.Export_Packaging where ID > @iMaxId order by ID`,
    firstPullWrite: productPullWrite_1.packFirstPullWrite,
};
exports.PriceX = {
    uq: uqs_1.uqs.jkProduct,
    type: 'map',
    entity: 'PriceX',
    mapper: {
        product: "ProductID@ProductX",
        pack: "PackingID@ProductX_PackX",
        arr1: {
            salesRegion: "^SalesRegionID@SalesRegion",
            expireDate: "^Expire_Date",
            discountinued: "^Discontinued",
            retail: "^Price",
        }
    },
    pull: `select top ${promiseSize} jp.ID, jp.PackagingID as PackingID, j.jkid as ProductID, jp.SalesRegionID, jp.Price
        , jp.Currency, jp.ExpireDate as Expire_Date, cast(jp.Discontinued as int) as Discontinued
        from ProdData.dbo.Export_PackagingSalesRegion jp inner join zcl_mess.dbo.jkcat j on jp.PackagingID = j.jkcat
        where jp.ID > @iMaxId order by jp.ID`,
    pullWrite: (joint, data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            data["Expire_Date"] = data["Expire_Date"].getTime();
            yield joint.uqIn(exports.PriceX, data);
            return true;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    })
};
exports.ProductChemical = {
    uq: uqs_1.uqs.jkProduct,
    type: 'map',
    entity: 'ProductChemical',
    mapper: {
        product: "ProductID@ProductX",
        arr1: {
            chemical: "^ChemicalID@Chemical",
            CAS: "^CAS",
            purity: "^Purity",
            molecularFomula: "^MolecularFomula",
            molecularWeight: "^MolecularWeight",
        }
    }
};
exports.ProductSalesRegion = {
    uq: uqs_1.uqs.jkProduct,
    type: 'map',
    entity: 'ProductSalesRegion',
    mapper: {
        product: 'ProductID@ProductX',
        arr1: {
            salesRegion: '^SalesRegionID@SalesRegion',
            isValid: '^IsValid',
        }
    },
    pull: `select top ${promiseSize} ID, ProductID, SalesRegionID, IsValid
        from ProdData.dbo.Export_ProductSalesRegion where ID > @iMaxId order by ID`,
};
exports.ProductLegallyProhibited = {
    uq: uqs_1.uqs.jkProduct,
    type: 'map',
    entity: 'ProductLegallyProhibited',
    mapper: {
        product: 'ProductID@ProductX',
        arr1: {
            salesRegion: '^SalesRegionID@SalesRegion',
            reason: '^Reason',
        }
    }
};
//# sourceMappingURL=product.js.map