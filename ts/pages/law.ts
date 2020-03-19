import { Request, Response } from "express";
import { ejsError, getRootPath } from "../tools";
import { buildData } from "../tools";
import { Dbs } from "../db";

export async function law(req: Request, res: Response) {
  
 
    let data = buildData(req, {
        nextpage: ''
    });

    res.render('law.ejs', data, (err, html) => {
        if (ejsError(err, res) === true) return;
        res.end(html);
    });
};