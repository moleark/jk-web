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

    let explain: string, html: string;
    let jk = ejs.fileLoader(viewPath + '/headers/jk' + ejsSuffix).toString();
    let hmInclude = ejs.fileLoader(viewPath + '/headers/hm' + ejsSuffix).toString();
    const ret = await Dbs.content.postFromId(216);
    let content = ret[0].content;
    if (content.charAt(0) === '#') {
        content = hmToEjs(content);
        explain = jk + hmInclude + content;
        let datas = buildData(req, {});
        html = ejs.render(explain, datas);
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
        html: html
    });

    res.render('category.ejs', data, (err, html) => {
        if (ejsError(err, res) === true) return;
        res.end(html);
    });
};