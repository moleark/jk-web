import { Request, Response } from "express";
import { ejsError, buildData } from "../tools";

export async function shop(req: Request, res:Response) {
    let data = buildData(req, undefined);
    res.render('shop.ejs', data, (err, html) => {
        if (ejsError(err, res) === true) return;
        res.end(html);
    });
};
