import { Request, Response } from "express";
import * as ejs from 'ejs';
import { Dbs } from "../db";
import { getRootPath, viewPath, ejsSuffix, ipHit, ejsError, buildData, hmToEjs } from "../tools";

export async function post(req: Request, res: Response) {
    let rootPath = getRootPath(req);
    try {
        let template: string, content: string, current: any, postsubject: any, postproduct: any;
        let discounts: any[] = [];
        let correlation: any[] = [];
        let id = req.params.id;

        //获取内容
        const ret = await Dbs.content.postFromId(id);
        if (ret.length === 0) {
            template = `post id=${id} is not defined`;
        }
        else {

            //获取优惠贴文
            discounts = await Dbs.content.getDiscountsPost(id);

            //相关贴文
            correlation = await Dbs.content.getCorrelationPost(id);

            //获取贴文的栏目
            postsubject = await Dbs.content.postSubject(id);


            //获取贴文产品
            postproduct = await Dbs.content.getPostProduct(id);

            //获取模板
            let header = ejs.fileLoader(viewPath + 'headers/header' + ejsSuffix).toString();
            let jk = ejs.fileLoader(viewPath + '/headers/jk' + ejsSuffix).toString();
            let hmInclude = ejs.fileLoader(viewPath + '/headers/hm' + ejsSuffix).toString();
            let homeHeader = ejs.fileLoader(viewPath + 'headers/home-header' + ejsSuffix).toString();
            let postHeader = ejs.fileLoader(viewPath + 'headers/post' + ejsSuffix).toString();
            let subjectHeader = ejs.fileLoader(viewPath + 'headers/subject' + ejsSuffix).toString();
            let subject = ejs.fileLoader(viewPath + 'right/subject' + ejsSuffix).toString();
            let subjectFooter = ejs.fileLoader(viewPath + 'footers/subject' + ejsSuffix).toString();
            let homeFooter = ejs.fileLoader(viewPath + 'footers/home-footer' + ejsSuffix).toString();
            let postFooter = ejs.fileLoader(viewPath + 'footers/post' + ejsSuffix).toString();

            //获取内容明细
            content = ret[0].content;
            if (content.charAt(0) === '#') {
                content = hmToEjs(content);
            }

            //获取优惠活动
            template = header
                + jk
                + hmInclude
                + homeHeader
                + postHeader
                + content
                + postFooter
                + subjectHeader
                + subject
                + subjectFooter
                + homeFooter;

            current = ret[0];
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

        let html = ejs.render(template, data);
        res.end(html);
        ipHit(req, id);
    }
    catch (e) {
        ejsError(e, res);
    }
};

