import { Request, Response } from "express";
import * as ejs from 'ejs';
import { Dbs } from "../db";
import { getRootPath, viewPath, ejsSuffix, ipHit, ejsError, buildData, hmToEjs } from "../tools";

export async function post(req: Request, res: Response) {
    let rootPath = getRootPath(req);
    let id = req.params.id;
    //获取内容
    const ret = await Dbs.content.postFromId(id);
    if (ret.length === 0) {
        res.status(404).end();
        return;
    }

    try {
        let content: string, current: any, postsubject: any, postproduct: any;
        let discounts: any[] = [];
        let correlation: any[] = [];

        //获取内容明细
        current = ret[0];
        //获取优惠贴文
        discounts = await Dbs.content.getDiscountsPost(id);
        //相关贴文
        correlation = await Dbs.content.getCorrelationPost(id);
        //获取贴文的栏目
        postsubject = await Dbs.content.postSubject(id);
        //获取贴文产品
        postproduct = await Dbs.content.getPostProduct(id);
        if (postproduct.length === 0) {
            postproduct = await Dbs.content.getRecommendProducts(id);
        }
        //获取产品目录树根节点
        const rootcategories = await Dbs.product.getRootCategories();

        //获取贴点贴文
        let cacheHotPosts: any[];
        let lastHotTick = 0;
        let now = Date.now();
        if (cacheHotPosts === undefined || now - lastHotTick > 60 * 1000) {
            lastHotTick = now;
            cacheHotPosts = await Dbs.content.getHotPost();
        }

        //获取栏目
        let subject: any[];
        subject = await Dbs.content.getSubject();
        content = await renderPostArticle(current);

        let data = buildData(req, {
            $title: current.caption,
            path: rootPath + 'post/',
            current: current,
            subject: subject,
            discounts: discounts,
            correlation: correlation,
            hotPosts: cacheHotPosts,
            rootcategories: rootcategories,
            content: content,
            postsubject: postsubject,
            postproduct: postproduct,
            titleshow: false
        });

        res.render('post/post.ejs', data);
        ipHit(req, id);
    }
    catch (e) {
        ejsError(e, res);
    }
};


export async function formattedTable(content: string) {
    let currentNode: number;
    for (currentNode = 0; currentNode < content.length; currentNode++) {

        let start: number, datastart: number, dataend: number;
        start = content.indexOf('#productlist', currentNode);
        if (start === -1)
            return content;
        datastart = content.indexOf('\n', start);
        dataend = content.indexOf('\n', datastart + 1);
        dataend = (dataend === -1) ? content.length : dataend
        let data = content.substring(datastart + 1, dataend);

        let list = data.split('|');
        let replacement: string = "";
        let listdata = await Dbs.product.searchProductByOrigin(list);

        replacement = formattedTableRow(listdata);
        let regexp = content.substring(start, dataend)
        content = content.replace(regexp, replacement);
        currentNode = currentNode > dataend ? currentNode : dataend;
    }
    return content;
}

function formattedTableRow(productlist: any[]) {
    if (productlist.length === 0)
        return "";
    const imagePath = 'https://www.jkchemical.com/static/Structure/';
    const productPath = "https://shop.jkchemical.com/?type=product&product=";
    let header: string = `<div class="row product-introduct">`
    let footers: string = `</div>`
    let content: string = ``

    productlist.forEach(element => {
        let { brandname, origin, description, descriptionc, cas } = element
        content += `<div class="col-lg-3">
                <div class="img-wrap">
                    <a href="`+ productPath + `"><img src="` + imagePath + `"></a>
                </div>
            </div>
            <div class="col-lg-9 each-product">
                <h3>
                    <a href="`+ productPath + `">
                    `+ description + `
                        <br>
                        `+ descriptionc + `
                    </a>
                </h3>
                <p>产品编号：  `+ origin + ` | CAS： ` + cas + `| 品牌： ` + brandname + ` </p>
            </div>
            <div class="col-lg-12 mt-lg-2">
            </div>`;
    });

    return header + content + footers;
}

export async function renderPostArticle(article: any) {
    let content = article.content;
    content = await formattedTable(content);

    if (content.charAt(0) === '#') {
        content = hmToEjs(content);
    }

    let template =
        ejs.fileLoader(viewPath + '/headers/jk' + ejsSuffix).toString()
        + ejs.fileLoader(viewPath + '/headers/hm' + ejsSuffix).toString()
        + content;

    return ejs.render(template, { article });
}