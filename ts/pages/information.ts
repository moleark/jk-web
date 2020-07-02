import { Request, Response } from "express";
import { Dbs } from "../db";
import { buildData, getRootPath, ejsError } from "../tools";

export async function information(req: Request, res: Response) {
    let rootPath = getRootPath(req);

    try {

        //获取当前页贴文
        let caption: string;
        let postpage: any[];
        let pageCount: number;
        let pageSize: number = 10;
        pageCount = req.query.pageCount ? parseInt(req.query.pageCount) : 0;
        postpage = await Dbs.content.informationPage(pageCount * pageSize, pageSize)

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

        let data = buildData(req, {
            nextpage: rootPath + 'information/?pageCount=' + nextpage,
            prepage: rootPath + 'information/?pageCount=' + prepage,
            path: rootPath + 'post/',
            post: postpage,
            pageCount: pageCount,
            hotPosts: cacheHotPosts,
            subject: subject,
            rootcategories: rootcategories
        });

        console.log(nextpage, 'nextpage')
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
