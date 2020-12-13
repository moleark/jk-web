import { NextFunction, Request, Response } from "express";
import * as ejs from 'ejs';
import { Dbs } from "../db";
import { renderPostArticle } from './post';
import { getRootPath, viewPath, ejsSuffix, ipHit, ejsError, buildData, hmToEjs } from "../tools";

export async function post_test(req: Request, res: Response, next: NextFunction) {
    let rootPath = getRootPath(req);
    let id = req.params.id;
    //获取内容
    const ret = await Dbs.content.postFromId(id);
    if (ret.length === 0) {
        res.status(404).end();
        return;
    }

    try {
        let content: string, current: any, postsubject: any, postproduct: any;
        let discounts: any[] = [];
        let correlation: any[] = [];

        //获取内容明细
        current = ret[0];
        //获取优惠贴文
        discounts = await Dbs.content.getDiscountsPost(id);
        //相关贴文
        correlation = await Dbs.content.getCorrelationPost(id);
        //获取贴文的栏目
        postsubject = await Dbs.content.postSubject(id);
        //获取贴文产品
        postproduct = await Dbs.content.getPostProduct(id);
        if (postproduct.length === 0) {
            postproduct = await Dbs.content.getRecommendProducts(id);
        }
        //获取产品目录树根节点
        const rootcategories = await Dbs.product.getRootCategories();

        //获取贴点贴文
        let cacheHotPosts: any[];
        let lastHotTick = 0;
        let now = Date.now();
        if (cacheHotPosts === undefined || now - lastHotTick > 60 * 1000) {
            lastHotTick = now;
            cacheHotPosts = await Dbs.content.getHotPost();
        }

        //获取栏目
        let subject: any[];
        subject = await Dbs.content.getSubject();
        content = await renderPostArticle(current);

        let data = buildData(req, {
            $title: current.caption,
            path: rootPath + 'post/',
            current: current,
            subject: subject,
            discounts: discounts,
            correlation: correlation,
            hotPosts: cacheHotPosts,
            rootcategories: rootcategories,
            content: content,
            postsubject: postsubject,
            postproduct: postproduct,
            titleshow: false
        });

        res.render('post/post.ejs', data);
        ipHit(req, id);
    }
    catch (e) {
        ejsError(e, res);
    }
}