import { Request, Response } from "express";
import * as ejs from 'ejs';
import { ejsError } from "../tools";

export async function test(req: Request, res:Response) {
    let data = {
        title: undefined,
    };
    let htmlText = await ejs.renderFile('./public/views/test.ejs', data);
    res.end(htmlText);
    /*
    res.render(htmlText, data, (err, html) => {
        if (ejsError(err, res) === true) return;
        res.end(html);
    });
    */
};
