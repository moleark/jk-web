import { Request, Response } from "express";
import { Dbs } from "../db";
import { buildData, getRootPath, ejsError } from "../tools";
import { setPreNextPage } from "../tools/setPreNextPage";

export async function information(req: Request, res: Response) {

    try {
        let discounts: any[] = [];
        let correlation: any[] = [];

        //获取当前页贴文
        let pageIndex: number;
        let pageSize: number = 10;
        pageIndex = req.query.pageIndex ? parseInt(req.query.pageIndex) : 0;
        let postpage: any[] = await Dbs.content.informationPage(pageIndex * pageSize, pageSize + 1)
        let { prepage, nextpage } = setPreNextPage(pageIndex, pageSize, postpage.length);
        if (nextpage > 0)
            postpage.pop();

        //获取栏目
        let subject: any[];
        subject = await Dbs.content.getAllSubjects();

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
            nextpage: nextpage,
            prepage: prepage,
            post: postpage,
            pageIndex: pageIndex,
            hotPosts: cacheHotPosts,
            subject: subject,
            discounts: discounts,
            correlation: correlation,
            rootcategories: rootcategories,
            titleshow: true
        });

        res.render('information.ejs', data, (err, html) => {
            if (ejsError(err, res) === true) return;
            res.end(html);
        });
    }
    catch (err) {
        console.error(err);
        res.end('error in parsing: ' + err.message);
    }

};
