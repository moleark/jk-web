import { Request, Response } from "express";
import * as ejs from 'ejs';
import { ejsError } from "../tools";

export async function test(req: Request, res:Response) {
    let data = {
        title: undefined,
    };
    let header = ejs.fileLoader('./public/views/headers/home-header.ejs').toString();
    let footer = ejs.fileLoader('./public/views/footers/home-footer.ejs').toString();
    let body = ejs.fileLoader('./public/views/test.ejs').toString();
    let html = ejs.render(header + body + footer, {title:undefined});
    res.end(html);
    /*
    res.render(htmlText, data, (err, html) => {
        if (ejsError(err, res) === true) return;
        res.end(html);
    });
    */
};
