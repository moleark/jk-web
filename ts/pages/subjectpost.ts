import { Request, Response } from "express";
import { ejsError, getRootPath, buildData } from "../tools";
import { Dbs } from "../db";
import { setPreNextPage } from "../tools/setPreNextPage";

export async function subjectpost(req: Request, res: Response) {

    try {
        //获取当前栏目
        let { params, query } = req;
        let currentId = Number(params.current);
        let currentSubject = await Dbs.content.subjectByid(currentId);
        let caption = currentSubject.name;
        let discounts: any[] = [];
        let correlation: any[] = [];

        //获取当前页贴文
        let pageIndex: number;
        let pageSize: number = 10;
        pageIndex = query.pageIndex ? parseInt(query.pageIndex) : 0;
        let postpage: any[] = await Dbs.content.subjectPost(currentId, pageIndex * pageSize, pageSize + 1)
        let { prepage, nextpage } = setPreNextPage(pageIndex, pageSize, postpage.length);
        if (nextpage > 0)
            postpage.pop();

        //获取栏目
        let allSubjects: any[];
        allSubjects = await Dbs.content.getAllSubjects();

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
            currentSubjectId: currentId,
            post: postpage,
            pageIndex: pageIndex,
            hotPosts: cacheHotPosts,
            subject: allSubjects,
            discounts: discounts,
            correlation: correlation,
            caption: caption,
            rootcategories: rootcategories,
            titleshow: false
        });

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