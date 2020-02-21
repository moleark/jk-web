import { Request, Response } from "express";
import * as ejs from 'ejs';
import { Dbs } from "../db";
import { viewPath, ejsSuffix, buildData, getRootPath, ejsError } from "../tools";

export async function morepost(req: Request, res: Response) {
    let rootPath = getRootPath(req);
    let postpage: any[];
    let pageCount: number;
    let pageSize: number = 30;
    try {
        pageCount = req.query.pageCount ? req.query.pageCount : 0;
        postpage = await Dbs.content.morePostPage(pageCount * pageSize, pageSize)

		/*
        let header = ejs.fileLoader(viewPath + 'headers/header' + ejsSuffix).toString();
        let jk = ejs.fileLoader(viewPath + '/headers/jk' + ejsSuffix).toString();
        let hmInclude = ejs.fileLoader(viewPath + '/headers/hm' + ejsSuffix).toString();
        let homeHeader = ejs.fileLoader(viewPath + 'headers/home-header' + ejsSuffix).toString();
        let postHeader = ejs.fileLoader(viewPath + 'headers/post' + ejsSuffix).toString();

        let postFooter = ejs.fileLoader(viewPath + 'footers/post' + ejsSuffix).toString();
        let homeFooter = ejs.fileLoader(viewPath + 'footers/home-footer' + ejsSuffix).toString();
		let body = ejs.fileLoader(viewPath + 'morepost.ejs').toString();
		*/
        let data = buildData(req, {
            nextpage: rootPath + 'morepost/?pageCount=' + (pageCount + 1),
            prepage: rootPath + 'morepost/?pageCount=' + (pageCount - 1),
            path: rootPath + 'post/',
            post: postpage,
        });
		/*
        let html = ejs.render(
            header
            + jk
            + hmInclude
            + homeHeader
            + postHeader
            + body
            + postFooter
            + homeFooter
            , data);
		res.end(html);
		*/
		res.render('morepost.ejs', data, (err, html) => {
			if (ejsError(err, res) === true) return;
			res.end(html);
		});
	
    }
    catch (err) {
        console.error(err);
        res.end('error in parsing: ' + err.message);
    }

};
