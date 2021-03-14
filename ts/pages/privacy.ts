import { Request, Response } from "express";
import * as ejs from 'ejs';
import * as config from 'config';
import { Dbs } from "../db";
import { getRootPath, viewPath, ejsSuffix, ipHit, ejsError, buildData, hmToEjs } from "../tools";

export async function privacy(req: Request, res: Response) {

    let privacyId = config.get<number>("privacyId");
    try {
        let template: string, content: string;
        let discounts: any[] = [];
        let correlation: any[] = [];
        let id = req.params.id;

        //获取内容
        const ret = await Dbs.content.postFromId(privacyId);
        if (ret.length === 0) {
            template = `post id=${id} is not defined`;
        }
        else {
            //获取模板
            let header = ejs.fileLoader(viewPath + 'headers/header' + ejsSuffix).toString();
            let homeHeader = ejs.fileLoader(viewPath + 'headers/home-header' + ejsSuffix).toString();
            let homeFooter = ejs.fileLoader(viewPath + 'footers/home-footer' + ejsSuffix).toString();

            //获取内容明细
            content = ret[0].content;
            if (content.charAt(0) === '#') {
                content = hmToEjs(content);
            }

            //获取优惠活动
            template = header
                + homeHeader
                + content
                + homeFooter;
        }

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
        subject = await Dbs.content.getAllSubjects();

        let data = await buildData(req, {
            subject: subject,
            discounts: discounts,
            correlation: correlation,
            hotPosts: cacheHotPosts,
            content: content,
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