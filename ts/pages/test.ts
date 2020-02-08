import { Request, Response } from "express";
import * as ejs from 'ejs';
import { ejsError } from "../tools";
import { isWechat } from "../tools";
import { viewPath, ejsSuffix } from "../tools";

export async function test(req: Request, res:Response) {
    let data = {
        title: undefined,
    };
    let m = isWechat(req)? '-m' : '';
    m = '-m';

    let header = ejs.fileLoader(viewPath + 'headers/home-header' + m + ejsSuffix).toString();
    let footer = ejs.fileLoader(viewPath + 'footers/home-footer' + m + ejsSuffix).toString();
    let body = ejs.fileLoader(viewPath + 'test.ejs').toString();
    let html = ejs.render(
        header 
        + '<div class="container my-3">'
        + body 
        + '</div>'
        + footer,
        data);
    res.end(html);
    /*
    res.render(htmlText, data, (err, html) => {
        if (ejsError(err, res) === true) return;
        res.end(html);
    });
    */
};
