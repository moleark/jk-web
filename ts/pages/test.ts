import { Request, Response } from "express";
import * as ejs from 'ejs';
import { buildData, hmParse, hmToEjs } from "../tools";
import { device } from "../tools";
import { viewPath, ejsSuffix } from "../tools";

export async function test(req: Request, res: Response) {
	try {
		let data = buildData(req, undefined);

		let header = ejs.fileLoader(viewPath + 'headers/header' + ejsSuffix).toString();
		let jk = ejs.fileLoader(viewPath + '/headers/jk' + ejsSuffix).toString();
		let hmInclude = ejs.fileLoader(viewPath + '/headers/hm' + ejsSuffix).toString();
		let homeHeader = ejs.fileLoader(viewPath + 'headers/home-header' + ejsSuffix).toString();

		let postAttachProduct = ejs.fileLoader(viewPath + 'post/post-attachproduct' + ejsSuffix).toString();
		let homeFooter = ejs.fileLoader(viewPath + 'footers/home-footer' + ejsSuffix).toString();

		let reqPath = req.path.toLowerCase();
		if (reqPath.endsWith('/') === true) {
			reqPath += 'index';
		}
		else if (reqPath === '/test') {
			reqPath += '/index';
		}

		let body = ejs.fileLoader(viewPath + reqPath + '.ejs').toString();
		if (body.charAt(0) === '#') {
			hmParse(body);
			body = hmToEjs(body);
		}

		let html = ejs.render(
			header
			+ jk
			+ hmInclude
			+ homeHeader
			+ body
			+ postAttachProduct
			+ homeFooter
			, data);
		res.end(html);
	}
	catch (err) {
		console.error(err);
		res.end('error in parsing: ' + err.message);
	}
};
