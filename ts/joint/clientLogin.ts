import { Request, Response } from "express";
import { Dbs } from "../db";

/**
 * 
 * @param req 
 * @param res 
 */
export async function clientLogin(req: Request, res: Response) {
    let { query } = req;
    let { lgtk } = query;
    if (lgtk) {
        let { jointPlatform: jointPlatform } = Dbs;
        let loginReq = await jointPlatform.getLoginReq(lgtk);
        if (loginReq) {
            res.json({ user: loginReq.myUsername, password: loginReq.password });
            return;
        }
    }
    res.status(404).end();
}