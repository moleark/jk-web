import { Request, Response } from "express";
import { Dbs } from "../db";
import { ejsError, ipHit, buildData, getRootPath, SALESREGION} from "../tools";

let cacheHtml: string;
//测试
export async function cas(req: Request, res: Response) {
    let rootPath = getRootPath(req);
    const casList = await Dbs.productIndex.CASInterval(SALESREGION);
    let data = buildData(req, {
        path: rootPath +'casSubclass/',
        casList: casList,
        
    });
    res.render('cas.ejs', data, (err, html) => {
        if (ejsError(err, res) === true) return;
        res.end(cacheHtml = html);
    });
};