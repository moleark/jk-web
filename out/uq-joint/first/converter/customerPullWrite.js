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
const lodash_1 = require("lodash");
const dateformat_1 = require("dateformat");
const customer_1 = require("../../settings/in/customer");
const tools_1 = require("../../mssql/tools");
const productPullWrite_1 = require("./productPullWrite");
function customerPullWrite(joint, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            data["CreateTime"] = data["CreateTime"] && dateformat_1.default(data["CreateTime"], "yyyy-mm-dd HH:MM:ss");
            yield joint.uqIn(customer_1.Customer, lodash_1.default.pick(data, ["CustomerID", "Name", "FirstName", "LastName", "XYZ", "Gender", "BirthDate", 'CreateTime', 'IsValid']));
            let promises = [];
            promises.push(joint.uqIn(customer_1.OrganizationCustomer, lodash_1.default.pick(data, ["CustomerID", "OrganizationID"])));
            let customerId = data["CustomerID"];
            let props = [
                { name: 'Tel1', type: 'tel1' },
                { name: 'Tel2', type: 'tel2' },
                { name: 'Mobile', type: 'mobile' },
                { name: 'Email1', type: 'email1' },
                { name: 'Email2', type: 'email2' },
                { name: 'Fax1', type: 'fax1' },
                { name: 'Fax2', type: 'fax2' },
            ];
            for (let prop of props) {
                let { name, type } = prop;
                let v = data[name];
                if (!v)
                    continue;
                promises.push(joint.uqIn(customer_1.CustomerContact, { 'ID': customerId + '-' + name, 'CustomerID': customerId, 'TypeID': type, 'Content': v }));
            }
            promises.push(joint.uqIn(customer_1.CustomerHandler, { "CustomerID": customerId, "SalesmanID": data["SalesmanID"], "CustomerServiceStuffID": data["CustomerServiceStuffID"] }));
            if (data['InvoiceTitle']) {
                // CustomerID作为发票的no
                promises.push(joint.uqIn(customer_1.InvoiceInfo, lodash_1.default.pick(data, ['CustomerID', 'InvoiceTitle', 'TaxNo', 'RegisteredAddress', 'RegisteredTelephone', 'BankName', 'BankAccountNumber'])));
                promises.push(joint.uqIn(customer_1.CustomerSetting, {
                    'CustomerID': customerId, 'InvoiceInfoID': customerId
                }));
            }
            yield Promise.all(promises);
            return true;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    });
}
exports.customerPullWrite = customerPullWrite;
function customerFirstPullWrite(joint, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield joint.uqIn(customer_1.Customer, lodash_1.default.pick(data, ["ID", "CustomerID", "Name", "FirstName", "LastName", "XYZ", "Gender", "BirthDate", 'CreateTime', 'IsValid']));
            let promises = [];
            promises.push(joint.uqIn(customer_1.OrganizationCustomer, lodash_1.default.pick(data, ["CustomerID", "OrganizationID"])));
            let customerId = data["CustomerID"];
            let props = [
                { name: 'Tel1', type: 'tel1' },
                { name: 'Tel2', type: 'tel2' },
                { name: 'Mobile', type: 'mobile' },
                { name: 'Email1', type: 'email1' },
                { name: 'Email2', type: 'email2' },
                { name: 'Fax1', type: 'fax1' },
                { name: 'Fax2', type: 'fax2' },
            ];
            for (let prop of props) {
                let { name, type } = prop;
                let v = data[name];
                if (!v)
                    continue;
                promises.push(joint.uqIn(customer_1.CustomerContact, { 'ID': customerId + '-' + name, 'CustomerID': customerId, 'TypeID': type, 'Content': v }));
            }
            promises.push(joint.uqIn(customer_1.CustomerHandler, { "CustomerID": customerId, "SalesmanID": data["SalesmanID"], "CustomerServiceStuffID": data["CustomerServiceStuffID"] }));
            if (data['InvoiceTitle']) {
                // CustomerID作为发票的no
                promises.push(joint.uqIn(customer_1.InvoiceInfo, lodash_1.default.pick(data, ['CustomerID', 'InvoiceTitle', 'TaxNo', 'RegisteredAddress', 'RegisteredTelephone', 'BankName', 'BankAccountNumber'])));
                promises.push(joint.uqIn(customer_1.CustomerSetting, {
                    'CustomerID': customerId, 'InvoiceInfoID': customerId
                }));
            }
            let promisesSql = [];
            let consigneeSql = `
            select ID, CID as CustomerID, userName as Name, userUnit as OrganizationName, isnull(userMobile, '') as Mobile
                    , email as Email, userZipCode as Zip, userAdd as Addr, isDefault
                    from dbs.dbo.net_OrderBase_txt where cid = @CustomerID order by ID`;
            promisesSql.push(tools_1.execSql(consigneeSql, [{ 'name': 'CustomerID', 'value': customerId }]));
            let invoiceContactSql = `
            select ID, CID as CustomerID, Name, Unit as OrganizationName, isnull(Mobile, '') as Mobile, Tel as Telephone
                    , Email, Zip, Addr, isDefault
                    from dbs.dbo.order_InvoiceInfo_txt where CID = @CustomerID order by ID`;
            promisesSql.push(tools_1.execSql(invoiceContactSql, [{ 'name': 'CustomerID', 'value': customerId }]));
            let sqlResult = yield Promise.all(promisesSql);
            promises.push(productPullWrite_1.pushRecordset(joint, sqlResult[0], customer_1.Contact));
            promises.push(productPullWrite_1.pushRecordset(joint, sqlResult[1], customer_1.Contact));
            yield Promise.all(promises);
            return true;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    });
}
exports.customerFirstPullWrite = customerFirstPullWrite;
function consigneeContactPullWrite(joint, contactData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield joint.uqIn(customer_1.Contact, contactData);
            yield joint.uqIn(customer_1.CustomerContacts, lodash_1.default.pick(contactData, ["ID", "CustomerID"]));
            return true;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    });
}
exports.consigneeContactPullWrite = consigneeContactPullWrite;
//# sourceMappingURL=customerPullWrite.js.map