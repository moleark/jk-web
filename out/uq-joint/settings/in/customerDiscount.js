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
const tools_1 = require("../../mssql/tools");
const uqOutRead_1 = require("../../first/converter/uqOutRead");
const config_1 = require("config");
const promiseSize = config_1.default.get("promiseSize");
exports.CustomerDiscount = {
    uq: uqs_1.uqs.jkCustomerDiscount,
    type: 'map',
    entity: 'CustomerDiscount',
    mapper: {
        customer: 'CustomerID@Customer',
        arr1: {
            brand: "^BrandID@Brand",
            discount: "^Discount",
            startDate: "^StartDate",
            endDate: "^EndDate",
        }
    },
    pull: (joint, uqIn, queue) => __awaiter(void 0, void 0, void 0, function* () {
        let sql = `select top ${promiseSize} md.ID, a.CID as CustomerID, md.Manu as BrandID, md.DiscountValue as Discount, a.StartDate, a.EndDate
        from ProdData.dbo.Export_AgreementManuDiscount md
        inner join dbs.dbo.Agreement a on md.AgreementID = a.AgreementID
        where md.ID > @iMaxId and a.objType = 'C' order by md.Id`;
        try {
            let ret = yield uqOutRead_1.uqOutRead(sql, queue);
            if (ret !== undefined) {
                let { data } = ret;
                data.map(e => {
                    e["StartDate"] = e["StartDate"].getTime();
                    e["EndDate"] = e["EndDate"].getTime();
                });
                return ret;
            }
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    })
};
exports.OrganizationDiscount = {
    uq: uqs_1.uqs.jkCustomerDiscount,
    type: 'map',
    entity: 'OrganizationDiscount',
    mapper: {
        organization: 'OrganizationID@Organization',
        arr1: {
            brand: "^BrandID@Brand",
            discount: "^Discount",
            startDate: "^StartDate",
            endDate: "^EndDate",
        }
    },
    pull: (joint, uqIn, queue) => __awaiter(void 0, void 0, void 0, function* () {
        let sql = `select top ${promiseSize} md.ID, a.CID as OrganizationID, md.Manu as BrandID, md.DiscountValue as Discount, a.StartDate, a.EndDate
        from ProdData.dbo.Export_AgreementManuDiscount md
        inner join dbs.dbo.Agreement a on md.AgreementID = a.AgreementID
        where md.ID > @iMaxId and a.objType = 'U' order by md.Id`;
        try {
            let ret = yield uqOutRead_1.uqOutRead(sql, queue);
            if (ret !== undefined) {
                let { data } = ret;
                data.map(e => {
                    e["StartDate"] = e["StartDate"].getTime();
                    e["EndDate"] = e["EndDate"].getTime();
                });
                return ret;
            }
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    })
};
exports.Agreement = {
    uq: uqs_1.uqs.jkCustomerDiscount,
    type: 'map',
    entity: 'Agreement',
    mapper: {
        organization: 'OrganizationID@Organization',
        startDate: 'StartDate',
        endDate: 'EndDate',
    },
    pull: `select top ${promiseSize} ID, AgreementID, CID, ObjType, StartDate, EndDate from ProdData.dbo.Export_Agreement where ID > @iMaxId and objType in ( 'C', 'U' ) order by ID`,
    pullWrite: (joint, data) => __awaiter(void 0, void 0, void 0, function* () {
        let sql = `select a.CID, md.Manu as BrandID, md.DiscountValue as Discount, a.StartDate, a.EndDate
                from dbs.dbo.Agreement a
                inner join dbs.dbo.AgreementManuDiscount md on md.AgreementID = a.AgreementID
                where a.AgreementID = @agreementID`;
        let result = undefined;
        try {
            result = yield tools_1.execSql(sql, [{ 'name': 'agreementID', 'value': data['AgreementID'] }]);
        }
        catch (error) {
            console.error(error);
            throw error;
        }
        if (result !== undefined) {
            let { recordset } = result;
            for (var i = 0; i < recordset.length; i++) {
                let row = recordset[i];
                let { CID, BrandID, Discount, StartDate, EndDate } = row;
                try {
                    if (data['ObjType'] === 'C') {
                        yield joint.uqIn(exports.CustomerDiscount, {
                            "CustomerID": CID,
                            "BrandID": BrandID, 'Discount': Discount, "StartDate": StartDate.getTime(), "EndDate": EndDate.getTime()
                        });
                    }
                    if (data['ObjType'] === 'U') {
                        yield joint.uqIn(exports.OrganizationDiscount, {
                            "OrganizationID": CID,
                            "BrandID": BrandID, 'Discount': Discount, "StartDate": StartDate.getTime(), "EndDate": EndDate.getTime()
                        });
                    }
                }
                catch (error) {
                    console.error(error);
                    throw error;
                }
            }
        }
        return true;
    })
};
//# sourceMappingURL=customerDiscount.js.map