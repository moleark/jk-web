import { Request, Response } from "express";
import { Dbs } from "../db";
import { ejsError, ipHit, buildData, getRootPath, SALESREGION } from "../tools";

let cacheHtml: string;

//测试
export async function casSubclass(req: Request, res: Response) {
    let rootPath = getRootPath(req);
    let current = req.params.current;
    let pageCount: number = 0;
    let pageSize: number = 5;
    pageCount = req.query.pageCount ? parseInt(req.query.pageCount) : 0;
    const casList = await Dbs.productIndex.getCASByInterval(SALESREGION, +current);


    let data = await buildData(req, {
        current: current,
        casList: casList,
        productPath: rootPath + 'search/'

    });
    res.render('casSubclass.ejs', data, (err, html) => {
        if (ejsError(err, res) === true) return;
        res.end(cacheHtml = html);
    });
};