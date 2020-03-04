import { Request, Response } from "express";
import { Dbs } from "../db";
import { ejsError, ipHit, buildData, getRootPath } from "../tools";

let lastHomeTick = Date.now();
let cacheHtml: string;
let cacheHotPosts: any[];
let lastHotTick = 0;
//测试
export async function home(req: Request, res: Response) {
    let rootPath = getRootPath(req);
    ipHit(req, -1);
    let now = Date.now();
    if (false && cacheHtml !== undefined) {
        let ht = lastHomeTick;
        lastHomeTick = now;
        if (lastHomeTick - ht < 3600 * 1000) {
            res.end(cacheHtml);
            return;
        };
    }
    const ret = await Dbs.content.homePostList();
    const categories = await Dbs.product.getRootCategories();
    for (let i = 0; i < categories.length; i++) {
        let category = categories[i];
        let { id } = category;
        categories[i].children = await Dbs.product.getChildrenCategories(id);
    }

    if (cacheHotPosts === undefined || now - lastHotTick > 60 * 1000) {
        lastHotTick = now;
        let ret = await Dbs.content.execProc('tv_hotPosts', [Dbs.unit, 0]);
        cacheHotPosts = ret[0];
    }
    console.log(rootPath,'rootPath')
    let data = buildData(req, {
        path: rootPath + 'post/',
        news: ret,
        categories: categories,
        hotPosts: cacheHotPosts,
    });
    res.render('home.ejs', data, (err, html) => {
        if (ejsError(err, res) === true) return;
        res.end(cacheHtml = html);
    });
};
