import { Request, Response } from "express";
import * as ejs from 'ejs';
import { buildData, hm, hmToEjs } from "../tools";
import { device } from "../tools";
import { viewPath, ejsSuffix } from "../tools";

export async function test(req: Request, res:Response) {
    try {
		hm(`#t0	a
一个实验小白，轻松掌控3个搅拌实验的奥秘
		
#[ border bg-light p-5 rounded mx-5

#p	c
您有过这种经历吗？

#p	c
实验无进展，论文未发表，导师催得紧，着急……<img src="https://c.jkchemical.com/res/0-0802.png"/>

#]
				`);

		let data = buildData(req, undefined);

		let header = ejs.fileLoader(viewPath + 'headers/header' + ejsSuffix).toString();
		let jk = ejs.fileLoader(viewPath + '/headers/jk' + ejsSuffix).toString();
		let hmInclude = ejs.fileLoader(viewPath + '/headers/hm' + ejsSuffix).toString();
		let homeHeader = ejs.fileLoader(viewPath + 'headers/home-header' + ejsSuffix).toString();
		let postHeader = ejs.fileLoader(viewPath + 'headers/post' + ejsSuffix).toString();

		let postFooter = ejs.fileLoader(viewPath + 'footers/post' + ejsSuffix).toString();
        let homeFooter = ejs.fileLoader(viewPath + 'footers/home-footer' + ejsSuffix).toString();
		let body = ejs.fileLoader(viewPath + 'testLY.ejs').toString();
		if (body.charAt(0) === '#') {
			body = hmToEjs(body);
		}

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
    }
    catch (err) {
        console.error(err);
        res.end('error in parsing: ' + err.message);
    }
};
