import { Request, Response } from "express";
import { Dbs } from "../db";
import { icon } from "../data";
import { ejsError, ipHit, buildData, getRootPath } from "../tools";

let lastHomeTick = Date.now();
let cacheHtml: string;
let cacheHotPosts: any[];
let lastHotTick = 0;

/**
 * TODO: 准备作废 
 * @param req 
 * @param res 
 * @returns 
 */
export async function allPosts(req: Request, res: Response) {
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
    const ret = await Dbs.content.allPosts();

    let data = await buildData(req, {
        path: rootPath + 'post/',
        news: ret,
    });
    res.render('all-posts.ejs', data, (err, html) => {
        if (ejsError(err, res) === true) return;
        res.end(cacheHtml = html);
    });
};
