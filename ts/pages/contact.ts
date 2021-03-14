import { Request, Response } from "express";
import { ejsError, getRootPath } from "../tools";
import { buildData } from "../tools";
import { Dbs } from "../db";

export async function contact(req: Request, res: Response) {


    let data = await buildData(req, {
        nextpage: ''
    });

    res.render('contact.ejs', data, (err, html) => {
        if (ejsError(err, res) === true) return;
        res.end(html);
    });
};