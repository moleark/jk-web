import { Request, Response } from "express";
import { ejsError, getRootPath } from "../tools";

export async function shop(req: Request, res:Response) {
    res.render('shop.ejs', {
        root: getRootPath(req),
        title:undefined
    }, (err, html) => {
        if (ejsError(err, res) === true) return;
        res.end(html);
    });
};
