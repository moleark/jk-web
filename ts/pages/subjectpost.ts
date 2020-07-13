import { Request, Response } from "express";
import { ejsError, getRootPath, buildData, hmToEjs, viewPath, ejsSuffix } from "../tools";
import { Dbs } from "../db";
import * as ejs from 'ejs';

export async function subjectpost(req: Request, res: Response) {
    let rootPath = getRootPath(req);

    try {
        //获取当前栏目
        let currentId = Number(req.params.current);
        let currentSubject = await Dbs.content.subjectByid(currentId);
        let caption = currentSubject.name;
        let discounts: any[] = [];
        let correlation: any[] = [];

        //获取当前页贴文

        let postpage: any[];
        let pageCount: number;
        let pageSize: number = 10;
        pageCount = req.query.pageCount ? parseInt(req.query.pageCount) : 0;
        postpage = await Dbs.content.subjectPost(currentId, pageCount * pageSize, pageSize)

        let nextpage: number = pageCount + 1;
        let prepage: number = pageCount - 1

        //获取栏目
        let subject: any[];
        subject = await Dbs.content.getSubject();

        //获取产品目录树根节点
        const rootcategories = await Dbs.product.getRootCategories();

        //获取热点贴文
        let cacheHotPosts: any[];
        let lastHotTick = 0;
        let now = Date.now();
        if (cacheHotPosts === undefined || now - lastHotTick > 60 * 1000) {
            lastHotTick = now;
            cacheHotPosts = await Dbs.content.getHotPost();
        }

        //获取优惠贴文
        discounts = await Dbs.content.getDiscountsPost(0);

        //相关贴文
        correlation = await Dbs.content.getCorrelationPost(0);


        let data = buildData(req, {
            nextpage: rootPath + 'subjectpost/' + currentId + '?pageCount=' + nextpage,
            prepage: rootPath + 'subjectpost/' + currentId + '?pageCount=' + prepage,
            path: rootPath + 'post/',
            post: postpage,
            pageCount: pageCount,
            hotPosts: cacheHotPosts,
            subject: subject,
            discounts: discounts,
            correlation: correlation,
            caption: caption,
            rootcategories: rootcategories,
            titleshow: false
        });

        console.log(nextpage, 'nextpage')
        res.render('subjectpost.ejs', data, (err, html) => {
            if (ejsError(err, res) === true) return;
            res.end(html);
        });
    }
    catch (err) {
        console.error(err);
        res.end('error in parsing: ' + err.message);
    }

};
