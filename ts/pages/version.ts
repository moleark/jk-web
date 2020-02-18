import { Request, Response } from "express";
import * as fs from "fs";
import * as ejs from 'ejs';
import { buildData, hm, hmToEjs } from "../tools";
import { viewPath, ejsSuffix } from "../tools";

export async function version(req: Request, res:Response) {
    try {
		let cbDataPackage = getPackageJson()
		function getPackageJson() {
			console.log('----------------------1.开始读取package.json')
			let _packageJson = fs.readFileSync('./package.json')
			console.log('----------------------读取package.json文件完毕')
			return JSON.parse(_packageJson.toString());
		}		

		let data = buildData(req, cbDataPackage);

		let header = ejs.fileLoader(viewPath + 'headers/header' + ejsSuffix).toString();
		let jk = ejs.fileLoader(viewPath + '/headers/jk' + ejsSuffix).toString();
		let hmInclude = ejs.fileLoader(viewPath + '/headers/hm' + ejsSuffix).toString();
		let homeHeader = ejs.fileLoader(viewPath + 'headers/home-header' + ejsSuffix).toString();
		let postHeader = ejs.fileLoader(viewPath + 'headers/post' + ejsSuffix).toString();

		let postFooter = ejs.fileLoader(viewPath + 'footers/post' + ejsSuffix).toString();
        let homeFooter = ejs.fileLoader(viewPath + 'footers/home-footer' + ejsSuffix).toString();
		let body = ejs.fileLoader(viewPath + 'version.ejs').toString();

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
