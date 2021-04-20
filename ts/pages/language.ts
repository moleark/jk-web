import { Request, Response } from "express";
import * as fs from "fs";
import * as ejs from 'ejs';
import { buildData } from "../tools";
import { viewPath, ejsSuffix } from "../tools";
import { Dbs } from "../db";

export async function language(req: Request, res: Response) {
    try {
        let data = await buildData(req);

        let header = ejs.fileLoader(viewPath + 'headers/header' + ejsSuffix).toString();
        let homeHeader = ejs.fileLoader(viewPath + 'headers/home-header' + ejsSuffix).toString();
        let body = ejs.fileLoader(viewPath + 'language/language.ejs').toString();
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