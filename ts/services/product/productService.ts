import { Client } from "@elastic/elasticsearch";
import { Search } from "@elastic/elasticsearch/api/requestParams";
import { isCAS } from "../tools/cas";
import { hasChineseChar } from "../tools/utils";
import * as config from 'config';

const esBaseUrl = config.get<string>('esBaseUrl');

class ProductService {

    private esClient: Client;
    constructor() {
        this.esClient = new Client({ node: esBaseUrl });
    }

    // 根据输入的查询关键字key构建调用es服务的查询
    async search(key: string, pageNumber = 1, pageSize = 20) {

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

        if (key.startsWith("MFCD") || key.startsWith("mfcd")) {
            should.push({ match: { mdlnumber: key } });
        } else if (isCAS(key)) {
            should.push({ match: { cas: key } });
            should.push({ match: { casint: key } });
            should.push({ match: { origin: key } });
        } else if (hasChineseChar(key)) {
            should.push({ match: { descriptionc: key } });
        } else {
            should.push({ match: { origin: key } });
            should.push({ match: { description: key } });
            should.push({ match: { descriptionc: key } });
        };
        (param.body as any).query.bool.should = should;
        let result = await this.esClient.search(param);
        console.log(JSON.stringify(result));
        return result;
    }
}

export const productService = new ProductService();