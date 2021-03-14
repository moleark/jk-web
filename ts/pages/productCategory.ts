import { Request, Response } from "express";
import { ejsError, getRootPath } from "../tools";
import { buildData } from "../tools";
import { Dbs } from "../db";

export async function productCategory(req: Request, res: Response) {
    let rootPath = getRootPath(req);
    let current = req.params.current;
    let currentId = Number(current);
    let productpage: any[];
    let pageCount: number = 0;
    let pageSize: number = 5;
    pageCount = req.query.pageCount ? parseInt(req.query.pageCount) : 0;
    productpage = await Dbs.product.searchProductByCategory(currentId, pageCount * pageSize, pageSize)
    let nextpage: number = pageCount + 1;
    let prepage: number = pageCount - 1;
    let data = await buildData(req, {
        nextpage: rootPath + 'product-catalog/' + currentId + '/?pageCount=' + nextpage,
        prepage: rootPath + 'product-catalog/' + currentId + '/?pageCount=' + prepage,
        current: current,
        productpage: productpage,
        pageCount: pageCount,
        path: rootPath + 'product/'
    });

    res.render('productCategory.ejs', data, (err, html) => {
        if (ejsError(err, res) === true) return;
        res.end(html);
    });
};