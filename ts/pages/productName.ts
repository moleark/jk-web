import { Request, Response } from "express";
import { Dbs } from "../db";
import { ejsError, ipHit, buildData, getRootPath, SALESREGION } from "../tools";

let cacheHtml: string;

//测试
export async function productName(req: Request, res: Response) {
    let rootPath = getRootPath(req);
    const SortName = await Dbs.productIndex.getSortNameIntervalGroup(SALESREGION);
    const subSortName = await Dbs.productIndex.SortNameInterval(SALESREGION,SortName[0].id);
    console.log(subSortName,'SortName')
    let data = buildData(req, {
        path: rootPath,
        SortName: SortName,
    });
    res.render('productName.ejs', data, (err, html) => {
        if (ejsError(err, res) === true) return;
        res.end(cacheHtml = html);
    });
};