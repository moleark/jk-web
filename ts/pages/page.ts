import { Request, Response } from "express";
import { Dbs } from "../db";
import { viewPath, ejsSuffix, ejsError, buildData, hmToEjs } from "../tools";
import * as ejs from 'ejs';
import { renderPostArticle } from "./post";

export async function page(req: Request, res: Response) {
    try {
        const ret = await Dbs.content.getPage(req.path);
        if (ret.length === 0) {
            res.status(404).end();
            return;
        }

        let template: string, title: string, postArticleHtml: string;
        let { post, url } = ret[0];
        let postret = await Dbs.content.postFromId(post);
        if (postret.length > 0) {
            postArticleHtml = await renderPostArticle(req, postret[0]);
        }
        /*
        let bodys: any = "";
        ret.forEach(element => {
            let body = element.content;
            if (body.charAt(0) === '#') {
                body = hmToEjs(body);
            }
            bodys += body;
        });
        */
        //获取产品目录树根节点
        const rootcategories = await Dbs.product.getRootCategories();

        let header = ejs.fileLoader(viewPath + 'headers/header' + ejsSuffix).toString();
        let homeHeader = ejs.fileLoader(viewPath + 'headers/home-header' + ejsSuffix).toString();
        let homeFooter = ejs.fileLoader(viewPath + 'footers/home-footer' + ejsSuffix).toString();

        template = header
            + homeHeader

            + postArticleHtml

            + homeFooter;
        title = ret[0].caption;

        let data = buildData(req, { $title: title, rootcategories: rootcategories, titleshow: true });
        let html = ejs.render(template, data);
        res.end(html);
    }
    catch (e) {
        ejsError(e, res);
    }
};