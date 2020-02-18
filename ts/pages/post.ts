import { Request, Response } from "express";
import * as ejs from 'ejs';
import { Db } from "../db";
import { device, viewPath, ejsSuffix, ipHit, ejsError, buildData, hmToEjs } from "../tools";

export async function post(req: Request, res:Response) {
    try {
        let id = req.params.id;
        const ret = await Db.content.postFromId(id);
        let template: string, title: string;
        if (ret.length === 0) {
            template =  `post id=${id} is not defined`;
        }
        else {
			let header = ejs.fileLoader(viewPath + 'headers/header' + ejsSuffix).toString();
			let jk = ejs.fileLoader(viewPath + '/headers/jk' + ejsSuffix).toString();
			let hmInclude = ejs.fileLoader(viewPath + '/headers/hm' + ejsSuffix).toString();
			let homeHeader = ejs.fileLoader(viewPath + 'headers/home-header' + ejsSuffix).toString();
			let postHeader = ejs.fileLoader(viewPath + 'headers/post' + ejsSuffix).toString();	
			let postFooter = ejs.fileLoader(viewPath + 'footers/post' + ejsSuffix).toString();
			let homeFooter = ejs.fileLoader(viewPath + 'footers/home-footer' + ejsSuffix).toString();
				let body = ret[0].content;
			if (body.charAt(0) === '#') {
				body = hmToEjs(body);
			}
	
			template = header
				+ jk
				+ hmInclude
				+ homeHeader
				+ postHeader
				+ body 
				+ postFooter
				+ homeFooter;
			title = ret[0].caption;
        }
        let data = buildData(req, {$title:title});
        let html = ejs.render(template, data);
        res.end(html);

        ipHit(req, id);
    }
    catch (e) {
        ejsError(e, res);
    }

    /*
    res.render('post.ejs', data, (err, html) => {
        if (ejsError(err, res) === true) return;
        res.end(html);
    });
    */
};

