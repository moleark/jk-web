import { Request, Response } from "express";
import { Db } from "../db";
import { categories, productNews, newsletter, latestProducts } from "../data";
import { ejsError, ipHit } from "../tools";

let lastHomeTick = Date.now();
let cacheHtml:string;
let cacheHotPosts: any[];
let lastHotTick = 0;
//测试
export async function home(req: Request, res:Response) {
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
    const ret = await Db.content.homePostList();
    
    if (cacheHotPosts === undefined || now - lastHotTick > 10*60*1000) {
        lastHotTick = now;
        let ret = await Db.content.execProc('tv_hotPosts', [Db.unit, 0]);
        cacheHotPosts = ret[0];
    }

    let data = {
        title: undefined,
        path: 'post/', // 'https://c.jkchemical.com/webBuilder/post/',
        news: ret,
        categories: categories,
        productNews: productNews,
        newsletter: newsletter,
        latestProducts: latestProducts,
        hotPosts: cacheHotPosts,
    };
    res.render('home.ejs', data, (err, html) => {
        if (ejsError(err, res) === true) return;
        res.end(cacheHtml = html);
    });
};
