import { Dbs } from "../db";

/**
 * 该方法用于将贴文内容中存在的指向老官网的url替换为对应的新官网的url 
 * @returns 
 */
export async function replacePostContentUrl(from: number, to: number) {

    for (let index = from; index <= to; index++) {
        let ret = await Dbs.content.postFromId(index);
        if (ret.length === 0)
            continue;

        let post = ret[0];
        let { content } = post;
        content = await replaceProduct(content);
        content = await replaceProductSearch(content);
        try {
            await Dbs.content.replaceContentUrl(index, content);
        } catch (error) {
            throw error;
        }
    }
}

/**
 * 替换贴文内容中的单个产品链接 
 * @param content 
 * @returns 
 */
async function replaceProduct(content: string) {

    let pattern = new RegExp(/https?:\/\/(www.)?jkchemical.com\/CH\/products\/(\w+)\.html/ig);
    let matched, thisResult = {};
    while ((matched = pattern.exec(content)) !== null) {
        let oldProductId = matched[2];
        let product = await Dbs.product.getProductByNo(oldProductId);
        if (product) {
            thisResult[oldProductId] = [matched[0], 'https://www.jkchemical.com/product/' + product.id];
        }
    }
    for (const p in thisResult) {
        content = content.replace(thisResult[p][0], thisResult[p][1]);
    }
    return content;
}

/**
 * 替换贴文内容中的产品搜索链接 
 * @param content 
 * @returns 
 */
async function replaceProductSearch(content: string) {

    let pattern = /https?:\/\/(www.)?jkchemical.com\/CH\/products\/search\/fulltextsearch\/(\w+)\.html/ig;
    let exists = content.match(pattern);
    content = content.replace(pattern, "https://www.jkchemical.com/search/$2");
    return content;
}