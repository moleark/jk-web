import { Request, Response } from "express";
import * as fs from "fs";
import * as ejs from 'ejs';
import { buildData, hmParse, hmToEjs } from "../tools";
import { viewPath, ejsSuffix } from "../tools";
import { Dbs } from "../db";

export async function version(req: Request, res: Response) {
	try {
		let cbDataPackage: any = getPackageJson();
		function getPackageJson() {
			console.log('----------------------1.开始读取package.json')
			let _packageJson = fs.readFileSync('./package.json')
			console.log('----------------------读取package.json文件完毕')
			return JSON.parse(_packageJson.toString());
		}

		const rootcategories = await Dbs.product.getRootCategories();
		let data = await buildData(req, { version: cbDataPackage.version, rootcategories: rootcategories });

		let header = ejs.fileLoader(viewPath + 'headers/header' + ejsSuffix).toString();
		let homeHeader = ejs.fileLoader(viewPath + 'headers/home-header' + ejsSuffix).toString();
		let body = ejs.fileLoader(viewPath + 'version.ejs').toString();
		let homeFooter = ejs.fileLoader(viewPath + 'footers/home-footer' + ejsSuffix).toString();

		let html = ejs.render(
			header
			+ homeHeader
			+ body
			+ homeFooter
			, data);
		res.end(html);
	}
	catch (err) {
		console.error(err);
		res.end('error in parsing: ' + err.message);
	}
};
