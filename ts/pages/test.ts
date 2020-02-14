import { Request, Response } from "express";
import * as ejs from 'ejs';
import { ejsError, getRootPath, buildData } from "../tools";
import { device } from "../tools";
import { viewPath, ejsSuffix } from "../tools";

export async function test(req: Request, res:Response) {
    try {
        let data = buildData(req, undefined);

        let header = ejs.fileLoader(viewPath + 'headers/header' + ejsSuffix).toString();
        let homeHeader = ejs.fileLoader(viewPath + 'headers/home-header' + ejsSuffix).toString();
        let homeFooter = ejs.fileLoader(viewPath + 'footers/home-footer' + ejsSuffix).toString();
        let body = ejs.fileLoader(viewPath + 'test1.ejs').toString();
        let html = ejs.render(
            header
            + homeHeader 
            + '<div class="container my-3">'
            + body 
            + '</div>'
            + homeFooter,
            data);
        res.end(html);
    }
    catch (err) {
        console.error(err);
        res.end('error in parsing: ' + err.message);
    }
    /*
    res.render(htmlText, data, (err, html) => {
        if (ejsError(err, res) === true) return;
        res.end(html);
    });
    */
};
