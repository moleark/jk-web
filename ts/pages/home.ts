import { Request, Response } from "express";
import { Dbs } from "../db";
import * as ejs from 'ejs';
import { ejsError, viewPath, ipHit, ejsSuffix, buildData, getRootPath, SALESREGION } from "../tools";

let lastHomeTick = Date.now();
let cacheHtml: string;

//测试
export async function home(req: Request, res: Response) {
    try {
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

        //轮播图
        let slideshowlist = await Dbs.content.getSlideshow();
        let random = Math.floor(Math.random() * 10 % (slideshowlist.length));
        let slideshow = slideshowlist[random];
        //资讯中心
        let information = await Dbs.content.informationPost();
        //优惠活动
        let discounts = await Dbs.content.subjectPost(18, 0, 30);
        //产品推荐
        let recommend = await Dbs.content.subjectPost(17, 0, 30);
        //获取热点贴文
        let cacheHotPosts: any[];
        let lastHotTick = 0;
        if (cacheHotPosts === undefined || now - lastHotTick > 60 * 1000) {
            lastHotTick = now;
            cacheHotPosts = await Dbs.content.getHotPost();
        }
        let header = ejs.fileLoader(viewPath + 'headers/header' + ejsSuffix).toString();
        let homeHeader = ejs.fileLoader(viewPath + 'headers/home-header' + ejsSuffix).toString();
        let home = ejs.fileLoader(viewPath + 'home' + ejsSuffix).toString();
        let homeFooter = ejs.fileLoader(viewPath + 'footers/home-footer' + ejsSuffix).toString();
        let template = header
            + homeHeader
            + home
            + homeFooter;

        console.log(rootPath, 'rootPath')
        let data = await buildData(req, {
            path: rootPath + 'post/',
            slideshow: slideshow,
            information: information,
            hots: cacheHotPosts,
            discounts: discounts,
            recommend: recommend,
            titleshow: true
        });
        let html = ejs.render(template, data);
        res.end(html);
    } catch (e) {
        ejsError(e, res);
    }

};
