import { Request, Response } from "express";
import { ejsError, getRootPath, buildData, hmToEjs, viewPath, ejsSuffix } from "../tools";
import { Dbs } from "../db";
import * as ejs from 'ejs';

export async function category(req: Request, res: Response) {
    let rootPath = getRootPath(req);
    let current = req.params.current;
    let currentId = Number(current);
    let category = await Dbs.product.getCategoryById(currentId);
    let children = await Dbs.product.getChildrenCategories(currentId);
    category.children = children;

    let explain: string = "", postID: string;
    let jk = ejs.fileLoader(viewPath + '/headers/jk' + ejsSuffix).toString();
    let hmInclude = ejs.fileLoader(viewPath + '/headers/hm' + ejsSuffix).toString();
    let postHeader = ejs.fileLoader(viewPath + 'headers/post' + ejsSuffix).toString();
    let postFooter = ejs.fileLoader(viewPath + 'footers/post' + ejsSuffix).toString();

    const categoryPost = await Dbs.content.categoryPost(currentId);

    const explainlist = await Dbs.content.categoryPostExplain(currentId);
    if (explainlist.length > 0) {
        postID = explainlist[0].post;
        const ret = await Dbs.content.postFromId(postID);
        if (ret.length > 0) {
            let content = ret[0].content;
            if (content.charAt(0) === '#') {
                content = hmToEjs(content);
                explain = jk + hmInclude + postHeader + content + postFooter;
                let datas = buildData(req, {});
                explain = ejs.render(explain, datas);
            }
        }
    }

    let productpage: any[];
    let pageCount: number = 0;
    let pageSize: number = 30;

    productpage = await Dbs.product.searchProductByCategory(currentId, pageCount * pageSize, pageSize);

    let data = buildData(req, {
        current: current,
        category: category,
        path: rootPath + 'category/',
        productPath: rootPath + 'productCategory/',
        postpath: rootPath + 'post/',
        explain: explain,
        categoryPost: categoryPost
    });

    res.render('category.ejs', data, (err, html) => {
        if (ejsError(err, res) === true) return;
        res.end(html);
    });
};