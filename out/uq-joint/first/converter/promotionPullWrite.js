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
const _ = require("lodash");
const tools_1 = require("../../mssql/tools");
const promotion_1 = require("../../settings/in/promotion");
const productPullWrite_1 = require("./productPullWrite");
function promotionFirstPullWrite(joint, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            data["StartDate"] = data["StartDate"] && dateformat_1.default(data["StartDate"], "yyyy-mm-dd HH:MM:ss");
            data["EndDate"] = data["EndDate"] && dateformat_1.default(data["EndDate"], "yyyy-mm-dd HH:MM:ss");
            data["CreateTime"] = data["CreateTime"] && dateformat_1.default(data["CreateTime"], "yyyy-mm-dd HH:MM:ss");
            yield joint.uqIn(promotion_1.Promotion, _.pick(data, ["ID", "Name", "Type", "Status", "StartDate", "EndDate", "CreateTime"]));
            let promises = [];
            promises.push(joint.uqIn(promotion_1.PromotionSalesRegion, _.pick(data, ["ID", "SalesRegionID"])));
            let promotionID = data["ID"];
            let promisesSql = [];
            let promotionLanguageSql = `
            select ExcID as ID, MarketingID as PromotionID, LanguageID, messageText as Description, Url
                    from dbs.dbo.MarketingMessageLanguages where MarketingID = @promotionID order by ExcID`;
            promisesSql.push(tools_1.execSql(promotionLanguageSql, [{ 'name': 'promotionID', 'value': promotionID }]));
            let readPromotionPacks = `
            select ExcID as ID, MarketingID as PromotionID, jkid as ProductID, jkcat as PackageID, activeDiscount as Discount, isnull(isStock, 0 ) as WhenHasStorage
                    from zcl_mess.dbo.ProductsMarketing where marketingID = @promotionID order by ExcID`;
            promisesSql.push(tools_1.execSql(readPromotionPacks, [{ 'name': 'promotionID', 'value': promotionID }]));
            let sqlResult = yield Promise.all(promisesSql);
            promises.push(productPullWrite_1.pushRecordset(joint, sqlResult[0], promotion_1.PromotionLanguage));
            promises.push(productPullWrite_1.pushRecordset(joint, sqlResult[1], promotion_1.PromotionPackDiscount));
            yield Promise.all(promises);
            return true;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    });
}
exports.promotionFirstPullWrite = promotionFirstPullWrite;
//# sourceMappingURL=promotionPullWrite.js.map