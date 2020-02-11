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
const config_1 = require("config");
const fetch_1 = require("../uq-joint/tool/fetch");
const webApiBaseUrl = config_1.default.get("busOutUrl");
class WebApiClient extends fetch_1.Fetch {
    constructor() {
        super(webApiBaseUrl);
    }
    newOrder(order) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // order = { Id: 'N20190201JKA', Customer: { Id: 'A250001' }, Maker: 'L38', SaleOrderItems: [{ Id: 'xxuigeuiiwege', PackageId: 'A250011_100g', Qty: 1, SalePrice: { Value: 100, Currency: 'RMB' } }] };
                yield this.post("SaleOrder/CreateNewSaleOrder", order);
                return true;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    test(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.get("Customer/Get/0023A8557A");
            return ret;
        });
    }
}
exports.WebApiClient = WebApiClient;
exports.httpClient = new WebApiClient();
//# sourceMappingURL=webApiClient.js.map