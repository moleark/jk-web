import { Request, Response } from "express";
import { ejsError, buildData } from "../tools";

export async function iframe(req: Request, res: Response) {
    let data = await buildData(req, undefined);
    res.render('iframe.ejs', data, (err, html) => {
        if (ejsError(err, res) === true) return;
        res.end(html);
    });
};
