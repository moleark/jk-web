import { Request, Response } from "express";
import { ejsError, getRootPath } from "../tools";
import { buildData } from "../tools";
import { Dbs } from "../db";

export async function category(req: Request, res: Response) {
    let rootPath = getRootPath(req);
    console.log(rootPath,'rootPath')
    let current = req.params.current;
    let currentId = Number(current);
    let category = await Dbs.product.getCategoryById(currentId);
    let children = await Dbs.product.getChildrenCategories(currentId);
    category.children = children;


    let productpage: any[];
    let pageCount: number = 0;
    let pageSize: number = 30;

    productpage = await Dbs.product.searchProductByCategory(currentId, pageCount * pageSize, pageSize)
    console.log(productpage)

    let data = buildData(req, {
        current: current,
        category: category,
        path: rootPath + 'category/'
    });

    res.render('category.ejs', data, (err, html) => {
        if (ejsError(err, res) === true) return;
        res.end(html);
    });
};