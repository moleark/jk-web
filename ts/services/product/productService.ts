import { Client } from "@elastic/elasticsearch";
import { Search } from "@elastic/elasticsearch/api/requestParams";
import { RequestBody } from "@elastic/elasticsearch/lib/Transport";
import { isCAS } from "../tools/cas";
import { hasChineseChar } from "../tools/utils";

// 根据输入的查询关键字key构建调用es服务的查询
export async function search(key: string, pageSize = 10, pageStart = 0) {

    if (!key)
        throw '';

    let client = new Client({ node: 'https://c.jkchemical.com/elasticsearch' });
    let param: Search = {
        index: "products",
        from: pageStart,
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
        let cas =
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
    let result = await client.search(param);
    console.log(JSON.stringify(result));
    return result;
}