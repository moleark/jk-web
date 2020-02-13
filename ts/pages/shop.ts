import { Request, Response } from "express";
import { ejsError } from "../tools";

export async function shop(req: Request, res:Response) {
    res.render('shop.ejs', {title:undefined}, (err, html) => {
        if (ejsError(err, res) === true) return;
        res.end(html);
    });
};
