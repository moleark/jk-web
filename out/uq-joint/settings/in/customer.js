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
const dateformat_1 = require("dateformat");
const uqs_1 = require("../uqs");
const customerPullWrite_1 = require("../../first/converter/customerPullWrite");
const config_1 = require("config");
const promiseSize = config_1.default.get("promiseSize");
exports.Customer = {
    uq: uqs_1.uqs.jkCustomer,
    type: 'tuid',
    entity: 'Customer',
    key: 'CustomerID',
    mapper: {
        $id: 'CustomerID@Customer',
        no: "CustomerID",
        name: 'Name',
        firstName: 'FirstName',
        lastName: 'LastName',
        gender: 'Gender',
        salutation: 'Salutation',
        birthDay: 'BirthDate',
        createTime: 'CreateTime',
        isValid: 'IsValid',
        XYZ: 'XYZ',
    },
    pull: `select top ${promiseSize} ID, CustomerID, OrganizationID, Name, FirstName, LastName, XYZ, Gender, BirthDate, Tel1, Tel2, Mobile, Email, Email2
           , Fax1, Fax2, Zip, InvoiceTitle, TaxNo, RegisteredAddress, RegisteredTelephone, BankName, BankAccountNumber
           , SalesmanID, CustomerServiceStuffID, IsValid, SalesComanyID as SalesCompanyID, SalesRegionBelongsTo, CreateTime
           from ProdData.dbo.Export_Customer where ID > @iMaxId order by ID`,
    pullWrite: customerPullWrite_1.customerPullWrite,
    firstPullWrite: customerPullWrite_1.customerFirstPullWrite,
};
exports.Organization = {
    uq: uqs_1.uqs.jkCustomer,
    type: 'tuid',
    entity: 'Organization',
    key: 'OrganizationID',
    mapper: {
        $id: 'OrganizationID@Organization',
        no: 'OrganizationID',
        name: 'Name',
        createTime: 'CreateTime',
    },
    pull: `select top ${promiseSize} ID, OrganizationID, UnitName as Name, CreateTime
           from ProdData.dbo.Export_Organization where ID > @iMaxId order by ID`,
    pullWrite: (joint, data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            data["CreateTime"] = data["CreateTime"] && dateformat_1.default(data["CreateTime"], "yyyy-mm-dd HH:MM:ss");
            yield joint.uqIn(exports.Organization, data);
            return true;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    })
};
exports.OrganizationCustomer = {
    uq: uqs_1.uqs.jkCustomer,
    type: 'map',
    entity: 'OrganizationCustomer',
    mapper: {
        organization: "OrganizationID@Organization",
        arr1: {
            customer: '^CustomerID@Customer',
        }
    }
};
exports.CustomerContact = {
    uq: uqs_1.uqs.jkCustomer,
    type: 'tuid-arr',
    entity: 'Customer_Contact',
    owner: 'CustomerID',
    key: 'ID',
    mapper: {
        $id: 'ID@Customer_Contact',
        type: 'TypeID',
        content: 'Content',
    }
};
exports.CustomerContacts = {
    uq: uqs_1.uqs.jkCustomer,
    type: 'map',
    entity: 'CustomerContacts',
    mapper: {
        customer: 'CustomerID@Customer',
        arr1: {
            contact: '^ID@Contact',
        }
    }
};
exports.Contact = {
    uq: uqs_1.uqs.jkCustomer,
    type: 'tuid',
    entity: 'Contact',
    key: 'ID',
    mapper: {
        $id: 'ID@Contact',
        name: 'Name',
        organizationName: 'OrganizationName',
        mobile: 'Mobile',
        telephone: 'Telephone',
        email: 'Email',
        addressString: 'Addr',
        address: "AddressID@Address",
    },
    pullWrite: customerPullWrite_1.consigneeContactPullWrite,
};
exports.InvoiceInfo = {
    uq: uqs_1.uqs.jkCustomer,
    type: 'tuid',
    entity: 'InvoiceInfo',
    key: 'CustomerID',
    mapper: {
        $id: 'CustomerID@InvoiceInfo',
        title: 'InvoiceTitle',
        address: 'RegisteredAddress',
        telephone: 'RegisteredTelephone',
        bank: 'BankName',
        accountNo: 'BankAccountNumber',
    },
};
exports.CustomerSetting = {
    uq: uqs_1.uqs.jkCustomer,
    type: 'map',
    entity: 'CustomerSetting',
    mapper: {
        customer: 'CustomerID@Customer',
        arr1: {
            shippingContact: '^ShippingContactID@Contact',
            invoiceContact: '^InvoiceContactID@Contact',
            invoiceType: '^InvoiceTypeID@InvoiceType',
            invoiceInfo: '^InvoiceInfoID@InvoiceInfo',
        }
    }
};
exports.CustomerHandler = {
    uq: uqs_1.uqs.jkCustomer,
    type: 'map',
    entity: 'CustomerHandler',
    mapper: {
        customer: 'CustomerID@Customer',
        salesman: 'SalesmanID@Employee',
        arr1: {
            customerServiceStuff: '^CustomerServiceStuffID@Employee',
        }
    }
};
//# sourceMappingURL=customer.js.map