import { Request, Response } from "express";
import { Dbs } from "../db";
import { renderPostContent } from "./post";

export async function productApplication(req: Request, res: Response) {
    let current = req.params.current;
    let currentId = Number(current);

    let explain: string = "", postID: string;
    const explainlist = await Dbs.content.getProductApplication(currentId);
    if (explainlist.length > 0) {
        postID = explainlist[0].post;
        const ret = await Dbs.content.postFromId(postID);
        if (ret.length > 0) {
            let postArticle = ret[0];
            explain = await renderPostContent(req, postArticle);
            res.send(explain);
        }
    } else {
        res.status(404).end();
    }
};