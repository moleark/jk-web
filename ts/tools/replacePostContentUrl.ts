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
        if (!content)
            continue;
        let result1 = await replaceProduct(content);
        let result2 = await replaceProductSearch(result1.content);
        let result3 = await replaceProductCategory(result2.content);
        if (result1.changed || result2.changed || result3.changed) {
            try {
                await Dbs.content.replaceContentUrl(index, result3.content);
            } catch (error) {
                throw error;
            }
        }
    }
}

/**
 * 替换贴文内容中的单个产品链接 
 * @param content 
 * @returns 
 */
async function replaceProduct(content: string) {

    let pattern = new RegExp(/https?:\/\/(www.)?jkchemical.com\/CH\/products\/(.+?)\.html/ig);
    let matchResult, thisResult = {}, matched = false;
    while ((matchResult = pattern.exec(content)) !== null) {
        thisResult[matchResult[2]] = matchResult[0];
    }

    for (const p in thisResult) {
        let product = await Dbs.product.getProductByNo(p);
        if (product) {
            content = content.split(thisResult[p]).join('https://web.jkchemical.com/product/' + product.id);
            matched = true;
        }
    }
    return { changed: matched, content }
}

/**
 * 替换贴文内容中的产品搜索链接 
 * @param content 
 * @returns 
 */
async function replaceProductSearch(content: string) {

    let pattern = /https?:\/\/(www.)?jkchemical.com\/CH\/products\/search\/fulltextsearch\/(.+?)\.html/ig;
    let exists = content.search(pattern);
    content = content.replace(pattern, "https://web.jkchemical.com/search/$2");
    return { changed: exists !== -1, content };
}

/**
 * 替换贴文内容中的产品目录树节点链接 
 * @param content 
 * @returns 
 */
async function replaceProductCategory(content: string) {

    let matchResult, thisResult = {}, matched = false;
    let pattern = new RegExp(/https?:\/\/(www.)?jkchemical.com\/zh-cn\/product-catalog\/parent\/(\d+)\.html/ig);
    while ((matchResult = pattern.exec(content)) !== null) {
        thisResult[matchResult[2]] = matchResult[0];
    }

    let pattern2 = new RegExp(/https?:\/\/(www.)?jkchemical.com\/zh-cn\/product-catalog\/(\d+)(\/\d+\/\d+)?.html/ig);
    while ((matchResult = pattern2.exec(content)) !== null) {
        thisResult[matchResult[2]] = matchResult[0];
    }

    let pattern3 = new RegExp(/https?:\/\/(www.)?jkchemical.com\/CH\/products\/search\/productcategory\/(\d+)(\/\d+)?.html/ig);
    while ((matchResult = pattern3.exec(content)) !== null) {
        thisResult[matchResult[2]] = matchResult[0];
    }

    for (const p in thisResult) {
        let productCategory = await Dbs.product.getCategoryByNo(p);
        if (productCategory) {
            // content = content.replace(thisResult[p], 'https://web.jkchemical.com/product-catalog/' + productCategory.id);
            content = content.split(thisResult[p]).join('https://web.jkchemical.com/product-catalog/' + productCategory.id);
            matched = true;
        }
    }
    return { changed: matched, content }
}