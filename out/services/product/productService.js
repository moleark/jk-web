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
exports.productService = void 0;
const elasticsearch_1 = require("@elastic/elasticsearch");
const cas_1 = require("../tools/cas");
const utils_1 = require("../tools/utils");
class ProductService {
    constructor() {
        this.esClient = new elasticsearch_1.Client({ node: 'https://c.jkchemical.com/elasticsearch' });
    }
    // 根据输入的查询关键字key构建调用es服务的查询
    search(key, pageStart = 0, pageSize = 20) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!key)
                throw '';
            let param = {
                index: "products",
                from: pageStart,
                size: pageSize,
                body: {
                    query: {
                        bool: {}
                    },
                    sort: [
                        "_score",
                        { "hasstock": "desc" },
                        { "level": "desc" }
                    ]
                }
            };
            let should = [];
            if (key.startsWith("MFCD") || key.startsWith("mfcd")) {
                should.push({ match: { mdlnumber: key } });
            }
            else if (cas_1.isCAS(key)) {
                should.push({ match: { cas: key } });
                should.push({ match: { casint: key } });
                should.push({ match: { origin: key } });
            }
            else if (utils_1.hasChineseChar(key)) {
                should.push({ match: { descriptionc: key } });
            }
            else {
                should.push({ match: { origin: key } });
                should.push({ match: { description: key } });
                should.push({ match: { descriptionc: key } });
            }
            ;
            param.body.query.bool.should = should;
            let result = yield this.esClient.search(param);
            console.log(JSON.stringify(result));
            return result;
        });
    }
}
exports.productService = new ProductService();
//# sourceMappingURL=productService.js.map