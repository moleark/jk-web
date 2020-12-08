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
            should.push({ match: { CAS: dashCAS } });
            should.push({ match: { origin: key } });
        } else if (key.startsWith("MFCD") || key.startsWith("mfcd")) {
            should.push({ match: { mdlnumber: key } });
        } else if (hasChineseChar(key)) {
            should.push({ match: { descriptionC: key } });
        } else {
            should.push({ match: { origin: key } });
            should.push({ match: { description: key } });
            should.push({ match: { descriptionC: key } });
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

        }
    }
}

export const productService = new ProductService();