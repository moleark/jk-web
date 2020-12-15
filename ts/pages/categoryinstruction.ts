import { Request, Response } from "express";
import { Dbs } from "../db";
import { renderPostArticle } from "./post";

export async function categoryInstruction(req: Request, res: Response) {
    let current = req.params.current;
    let currentId = Number(current);

    let explain: string = "", postID: string;
    const explainlist = await Dbs.content.getCategoryInstruction(currentId);
    if (explainlist.length > 0) {
        postID = explainlist[0].post;
        const ret = await Dbs.content.postFromId(postID);
        if (ret.length > 0) {
            let postArticle = ret[0];
            explain = await renderPostArticle(req, postArticle);
            res.send(explain);
        }
    } else {
        res.status(404).end();
    }
};