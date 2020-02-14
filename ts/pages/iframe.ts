import { Request, Response } from "express";
import * as ejs from 'ejs';
import { ejsError, getRootPath } from "../tools";

export async function iframe(req: Request, res:Response) {
    res.render('iframe.ejs', {
        root: getRootPath(req),
        title:undefined
    }, (err, html) => {
        if (ejsError(err, res) === true) return;
        res.end(html);
    });
};
