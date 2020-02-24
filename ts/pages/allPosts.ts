import { Request, Response } from "express";
import { Dbs } from "../db";
import { categories } from "../data";
import { ejsError, ipHit, buildData, getRootPath } from "../tools";

let lastHomeTick = Date.now();
let cacheHtml:string;
let cacheHotPosts: any[];
let lastHotTick = 0;
//测试
export async function allPosts(req: Request, res:Response) {
    let rootPath = getRootPath(req);
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
    const ret = await Dbs.content.allPosts();
    
    let data = buildData(req, {
        path: rootPath + 'post/', 
        news: ret,
    });
    res.render('all-posts.ejs', data, (err, html) => {
        if (ejsError(err, res) === true) return;
        res.end(cacheHtml = html);
    });
};
