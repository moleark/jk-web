import { Request, Response } from "express";
import { Dbs } from "../db";
import { categories } from "../data";
import { ejsError, ipHit, buildData, getRootPath } from "../tools";

let lastHomeTick = Date.now();
let cacheHtml:string;
let cacheHotPosts: any[];
let lastHotTick = 0;
//测试
export async function home(req: Request, res:Response) {
    let rootPath = getRootPath(req);
    console.log(rootPath,'rootPath')
    ipHit(req, -1);
    let now = Date.now();
    if (false && cacheHtml !== undefined) {
        let ht = lastHomeTick;
        lastHomeTick = now;
        if (lastHomeTick - ht < 3600*1000) {
            res.end(cacheHtml);
            return;
        };
    }
    const ret = await Dbs.content.homePostList();
    
    if (cacheHotPosts === undefined || now - lastHotTick > 10*60*1000) {
        lastHotTick = now;
        let ret = await Dbs.content.execProc('tv_hotPosts', [Dbs.unit, 0]);
        cacheHotPosts = ret[0];
    }

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
