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

        //获取最新贴文
        let newpost = await Dbs.content.homePostList();
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
        //获取根目录节点
        const rootcategories = await Dbs.product.getRootCategories();
        for (let i = 0; i < rootcategories.length; i++) {
            let category = rootcategories[i];
            let { id } = category;
            rootcategories[i].children = await Dbs.product.getChildrenCategories(id);
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
        let data = buildData(req, {
            path: rootPath + 'post/',
            news: newpost,
            hots: cacheHotPosts,
            discounts: discounts,
            recommend: recommend,
            rootcategories: rootcategories,
            titleshow: true
        });
        let html = ejs.render(template, data);
        res.end(html);
    } catch (e) {
        ejsError(e, res);
    }

};
