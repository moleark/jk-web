import { Request, Response } from "express";
import { Dbs } from "../db";
import { viewPath, ejsSuffix, ejsError, buildData, hmToEjs } from "../tools";
import * as ejs from 'ejs';

export async function page(req: Request, res: Response) {
    try {
        let id = req.params.id;
        let pagename = req.path.substring(1, req.path.length);
        const ret = await Dbs.content.getPage(pagename);
        let template: string, title: string;
        if (ret.length === 0) {
            template = `post id=${id} is not defined`;
        }
        else {
            let header = ejs.fileLoader(viewPath + 'headers/header' + ejsSuffix).toString();
            let jk = ejs.fileLoader(viewPath + '/headers/jk' + ejsSuffix).toString();
            let hmInclude = ejs.fileLoader(viewPath + '/headers/hm' + ejsSuffix).toString();
            let homeHeader = ejs.fileLoader(viewPath + 'headers/home-header' + ejsSuffix).toString();
            let postHeader = ejs.fileLoader(viewPath + 'headers/post' + ejsSuffix).toString();
            let postFooter = ejs.fileLoader(viewPath + 'footers/post' + ejsSuffix).toString();
            let homeFooter = ejs.fileLoader(viewPath + 'footers/home-footer' + ejsSuffix).toString();


            let bodys: any = "";
            ret.forEach(element => {
                let body = element.content;
                if (body.charAt(0) === '#') {
                    body = hmToEjs(body);
                }
                bodys += body;
            });

            template = header
                + jk
                + hmInclude
                + homeHeader
                + postHeader
                + bodys
                + postFooter
                + homeFooter;
            title = ret[0].caption;
        }
        let data = buildData(req, { $title: title });
        let html = ejs.render(template, data);
        res.end(html);

    }
    catch (e) {
        ejsError(e, res);
    }

};