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
const config = require("config");
const esBaseUrl = config.get('esBaseUrl');
class ProductService {
    constructor() {
        this.esClient = new elasticsearch_1.Client({ node: esBaseUrl });
    }
    // 根据输入的查询关键字key构建调用es服务的查询
    search(key, pageNumber = 1, pageSize = 20, debug = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!key)
                throw '';
            key = key.trim();
            let from = (pageNumber - 1) * pageSize;
            let param = {
                index: "products",
                from: from,
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
            if (cas_1.isCAS(key)) {
                let dashCAS = cas_1.cas2string(key);
                should.push({ term: { CAS: { value: dashCAS, boost: 0.8 } } });
                should.push({ term: { origin: { value: key, boost: 1.2 } } });
            }
            else if (key.startsWith("MFCD") || key.startsWith("mfcd")) {
                should.push({ term: { mdlnumber: key } });
            }
            else if (utils_1.hasChineseChar(key)) {
                should.push({
                    wildcard: {
                        descriptionC: {
                            value: '*' + key + '*',
                            case_insensitive: true
                        }
                    }
                });
            }
            else {
                should.push({ term: { origin: { value: key, boost: 3 } } });
                // should.push({ match: { description: key } });
                should.push({
                    wildcard: {
                        description: {
                            value: '*' + key + '*',
                            case_insensitive: true
                        }
                    }
                });
                // should.push({ match: { descriptionC: key } });
                should.push({
                    wildcard: {
                        descriptionC: {
                            value: '*' + key + '*',
                            case_insensitive: true
                        }
                    }
                });
            }
            ;
            param.body.query.bool.should = should;
            try {
                let esResult = yield this.esClient.search(param);
                if (debug)
                    return esResult;
                let { body } = esResult;
                let { took, hits } = body;
                let { total, hits: ihits } = hits;
                return { took, total, hits: ihits.map((e) => { return Object.assign({ "sort": e.sort, "_score": e._score }, e._source); }) };
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    /**
     *
     * @param catalogId
     * @param pageNumber
     * @param pageSize
     * @param debug
     */
    getProductsInCatalog(catalogId, pageNumber = 1, pageSize = 20, debug = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!catalogId)
                throw '';
            let from = (pageNumber - 1) * pageSize;
            let param = {
                index: "productproductcatalog",
                from: from,
                size: pageSize,
                body: {
                    query: {
                        term: { catalog: { value: catalogId } }
                    },
                    sort: [
                        "_score",
                        { "order": "asc" }
                    ]
                }
            };
            try {
                // 查询过程，从目录树索引中查询得到所包含的productid，然后再根据此id到product索引中再次查询
                // 第二次的查询结果合并到第一次的查询结果中
                let esResult = yield this.esClient.search(param);
                if (debug)
                    return esResult;
                let { body } = esResult;
                let { took, hits } = body;
                let { total, hits: ihits } = hits;
                let productIds = ihits.map((e) => e._source.product);
                let param2 = {
                    index: "products",
                    size: pageSize,
                    body: {
                        query: { ids: { values: productIds } }
                    }
                };
                let esResult2 = yield this.esClient.search(param2);
                let { body: body2 } = esResult2;
                let { hits: hits2 } = body2;
                let { hits: ihits2 } = hits2;
                return {
                    took,
                    total,
                    hits: ihits.map((e) => {
                        let product = ihits2.find((p) => p._source.id === e._source.product);
                        if (product)
                            return Object.assign({ "sort": e.sort, "_score": e._score }, product._source);
                    })
                };
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
}
exports.productService = new ProductService();
//# sourceMappingURL=productService.js.map