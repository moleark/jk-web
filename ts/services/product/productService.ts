import { Client } from "@elastic/elasticsearch";
import { Search } from "@elastic/elasticsearch/api/requestParams";
import { isCAS, cas2string } from "../tools/cas";
import { hasChineseChar } from "../tools/utils";
import * as config from 'config';

const esBaseUrl = config.get<string>('esBaseUrl');

class ProductService {

    private esClient: Client;
    constructor() {
        this.esClient = new Client({ node: esBaseUrl });
    }

    // 根据输入的查询关键字key构建调用es服务的查询
    async search(key: string, pageNumber = 1, pageSize = 20, debug = false) {

        if (!key)
            throw '';
        key = key.trim();

        let from = (pageNumber - 1) * pageSize;
        let param: Search = {
            index: "products",
            from: from,
            size: pageSize,
            body: {
                query: {
                    bool: {
                    }
                },
                sort: [
                    "_score",
                    { "hasstock": "desc" },
                    { "level": "desc" }
                ]
            }
        };
        let should = [];

        if (isCAS(key)) {
            let dashCAS = cas2string(key);
            should.push({ term: { CAS: { value: dashCAS, boost: 0.8 } } });
            should.push({ term: { origin: { value: key, boost: 1.2 } } });
        } else if (key.startsWith("MFCD") || key.startsWith("mfcd")) {
            should.push({ term: { mdlnumber: key } });
        } else if (hasChineseChar(key)) {
            should.push({
                wildcard: {
                    descriptionC: {
                        value: '*' + key + '*',
                        case_insensitive: true
                    }
                }
            });
        } else {
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
        };
        (param.body as any).query.bool.should = should;
        try {
            let esResult = await this.esClient.search(param);
            if (debug)
                return esResult;
            let { body } = esResult;
            let { took, hits } = body;
            let { total, hits: ihits } = hits;
            return { took, total, hits: ihits.map((e: any) => { return Object.assign({ "sort": e.sort, "_score": e._score }, e._source); }) };
        } catch (error) {
            console.log(error);
            throw error;
        }
    }


    /**
     * 
     * @param catalogId 
     * @param pageNumber 
     * @param pageSize 
     * @param debug 
     */
    async getProductsInCatalog(catalogId: number, pageNumber = 1, pageSize = 20, debug = false) {

        if (!catalogId)
            throw '';

        let from = (pageNumber - 1) * pageSize;
        let param: Search = {
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
            let esResult = await this.esClient.search(param);
            if (debug)
                return esResult;
            let { body } = esResult;
            let { took, hits } = body;
            let { total, hits: ihits } = hits;
            let productIds = ihits.map((e: any) => e._source.product);
            let param2: Search = {
                index: "products",
                size: pageSize,
                body: {
                    query: { ids: { values: productIds } }
                }
            }
            let esResult2 = await this.esClient.search(param2);
            let { body: body2 } = esResult2;
            let { hits: hits2 } = body2;
            let { hits: ihits2 } = hits2;

            return {
                took,
                total,
                hits: ihits.map((e: any) => {
                    let product = ihits2.find((p: any) => p._source.id === e._source.product);
                    if (product)
                        return Object.assign({ "sort": e.sort, "_score": e._score }, product._source);
                })
            };
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

export const productService = new ProductService();