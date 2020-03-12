import { Request, Response } from "express";
import { Dbs } from "../db";
import { ejsError, ipHit, buildData, getRootPath, SALESREGION } from "../tools";

let cacheHtml: string;

//测试
export async function productName(req: Request, res: Response) {
    let rootPath = getRootPath(req);
    const sortName = await Dbs.productIndex.getSortNameIntervalGroup(SALESREGION);
    let subSortName = await Dbs.productIndex.SortNameInterval(SALESREGION, sortName[0].id);

    let list = [];
    for(var i = 0; i < sortName.length; i++ ) {
        let subSortName = await Dbs.productIndex.SortNameInterval(SALESREGION, sortName[i].id);
        list.push(subSortName)
    }
    let data = buildData(req, {
        productPath: rootPath + 'search/',
        sortName: sortName,
        subSortName: subSortName,
        list: list
    });
    res.render('productName.ejs', data, (err, html) => {
        if (ejsError(err, res) === true) return;
        res.end(cacheHtml = html);
    });
};