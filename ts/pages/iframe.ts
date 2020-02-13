import { Request, Response } from "express";
import * as ejs from 'ejs';
import { ejsError } from "../tools";

export async function iframe(req: Request, res:Response) {
    res.render('iframe.ejs', {title:undefined}, (err, html) => {
        if (ejsError(err, res) === true) return;
        res.end(html);
    });
};
