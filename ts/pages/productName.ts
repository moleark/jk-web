import { Request, Response } from "express";
import { Dbs } from "../db";
import { ejsError, ipHit, buildData, getRootPath, SALESREGION } from "../tools";

let cacheHtml: string;

//测试
export async function productName(req: Request, res: Response) {
    let rootPath = getRootPath(req);
    const SortName = await Dbs.productIndex.getSortNameIntervalGroup(SALESREGION);
    console.log(SortName,'SortName')
    let data = buildData(req, {
        path: rootPath,
        news: '',
        categories: '',
        hotPosts: '',
    });
    res.render('productName.ejs', data, (err, html) => {
        if (ejsError(err, res) === true) return;
        res.end(cacheHtml = html);
    });
};