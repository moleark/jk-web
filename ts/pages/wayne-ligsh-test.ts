import { Request, Response } from "express";

export async function wayneLigshTest(req: Request, res:Response) {
    res.render('wayne-ligsh-test.ejs', {}, (err, html) => {
        res.end(html);
    });
}
