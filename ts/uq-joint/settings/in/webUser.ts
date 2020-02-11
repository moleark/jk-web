import { UqInTuid, UqInMap, Joint, DataPullResult } from "../../uq-joint";
import * as _ from 'lodash';
import { uqs } from "../uqs";
import config from 'config';

const promiseSize = config.get<number>("promiseSize");

export const WebUserTonva: UqInTuid = {
    uq: uqs.jkWebUser,
    type: 'tuid',
    entity: 'WebUserTonva',
    key: 'WebUserID',
    mapper: {
        $type: 'Type',      // 固定值:$user
        id: 'IGNORE',
        name: 'UserName',
        pwd: 'Password',
        nick: "IGNORE",
        icon: "IGNORE",
        country: "IGNORE",
        mobile: 'Mobile',
        email: 'Email',
        wechat: 'WechatOpenID',
    },
    pull: `select top ${promiseSize} ID, WebUserID, '$user' as Type, UserName, Password, null as Nick, null as Icon
           , TrueName as FirstName, OrganizationName, DepartmentName, Salutation
           , Mobile, Telephone, Email, Fax, WechatOpenID
           , Country, Province, City, Address, ZipCode
           , InvoiceType, InvoiceTitle, TaxNo, BankAccountName
           , CustomerID, SalesRegionBelongsTo, SalesCompanyID
           from alidb.ProdData.dbo.Export_WebUser w
           where ID > @iMaxId and State = 1 order by ID`,
    pullWrite: async (joint: Joint, data: any) => {
        try {
            let userId = await joint.userIn(WebUserTonva,
                _.pick(data,
                    ['Type', 'WebUserID', 'UserName', 'Password', 'Nick', 'Icon', 'Mobile', 'Email', 'WechatOpenID']));
            if (userId < 0)
                return;
            data.UserID = userId;
            let promises: PromiseLike<any>[] = [];
            promises.push(joint.uqIn(WebUser, _.pick(data, ['UserID', 'WebUserID', 'FirstName', 'Salutation', 'OrganizationName', 'DepartmentName'])));
            promises.push(joint.uqIn(WebUserContact, _.pick(data, ['UserID', 'Mobile', 'Email', 'OrganizationName', 'DepartmentName'
                , 'Telephone', 'Fax', 'ZipCode', 'WechatOpenID'])));
            if (data['CustomerID'])
                promises.push(joint.uqIn(WebUserCustomer, _.pick(data, ['UserID', 'CustomerID'])));
            // promises.push(joint.uqIn(WebUserSetting, _.pick(data, ['WebUserID', 'InvoiceTypeID'])));
            await Promise.all(promises);
            return true;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};

export const WebUser: UqInTuid = {
    uq: uqs.jkWebUser,
    type: 'tuid',
    entity: 'WebUser',
    key: 'WebUserID',
    mapper: {
        $id: 'UserID',
        no: "WebUserID",
        name: 'FirstName',
        firstName: "FirstName",
        salutation: "Salutation",
        organizationName: 'OrganizationName',
        departmentName: 'DepartmentName',
    }
}

export const WebUserContact: UqInMap = {
    uq: uqs.jkWebUser,
    type: 'map',
    entity: 'WebUserContact',
    mapper: {
        webUser: 'UserID',
        arr1: {
            mobile: '^Mobile',
            email: '^Email',
            organizationName: '^OrganizationName',
            departmentName: '^DepartmentName',
            telephone: '^Telephone',
            fax: '^Fax',
            zipCode: '^ZipCode',
            address: '',
            wechatId: 'Wechat',
        }
    }
};

export const WebUserCustomer: UqInMap = {
    uq: uqs.jkWebUser,
    type: 'map',
    entity: 'WebUserCustomer',
    mapper: {
        webUser: 'UserID',
        arr1: {
            customer: '^CustomerID@Customer',
        }
    }
};

export const WebUserContacts: UqInMap = {
    uq: uqs.jkWebUser,
    type: 'map',
    entity: 'WebUserContacts',
    mapper: {
        webUser: 'UserID',
        arr1: {
            contact: '^ID@Contact',
        }
    }
};

export const WebUserSetting: UqInMap = {
    uq: uqs.jkWebUser,
    type: 'map',
    entity: 'WebUserSetting',
    mapper: {
        customer: 'UserID',
        arr1: {
            shippingContact: '^ShippingContactID@Contact',
            invoiceContact: '^InvoiceContactID@Contact',
            invoiceType: '^InvoiceTypeID@InvoiceType',
            invoiceInfo: '^InvoiceInfoID@InvoiceInfo',
        }
    }
};