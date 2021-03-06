import { Request, Response } from "express";
import { Dbs } from "../db";
import { ejsError, ipHit, buildData, getRootPath, SALESREGION } from "../tools";

let cacheHtml: string;

//测试
export async function technicalSupport(req: Request, res: Response) {
    let rootPath = getRootPath(req);
    const sortName = await Dbs.productIndex.getSortNameIntervalGroup(SALESREGION);

    let list = [];
    for (var i = 0; i < sortName.length; i++) {
        let subSortName = await Dbs.productIndex.SortNameInterval(SALESREGION, sortName[i].id);
        list.push(subSortName)
    }
    let data = await buildData(req, {
        productPath: '',
        sortName: '',

    });
    res.render('technicalSupport.ejs', data, (err, html) => {
        if (ejsError(err, res) === true) return;
        res.end(cacheHtml = html);
    });
};