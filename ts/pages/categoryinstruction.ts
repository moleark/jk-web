import { Request, Response } from "express";
import { ejsError, getRootPath, buildData, hmToEjs, viewPath, ejsSuffix } from "../tools";
import { Dbs } from "../db";
import * as ejs from 'ejs';

export async function categoryInstruction(req: Request, res: Response) {
    let current = req.params.current;
    let currentId = Number(current);

    let explain: string = "", postID: string;
    let jk = ejs.fileLoader(viewPath + '/headers/jk' + ejsSuffix).toString();
    let hmInclude = ejs.fileLoader(viewPath + '/headers/hm' + ejsSuffix).toString();
    let postHeader = ejs.fileLoader(viewPath + 'headers/post' + ejsSuffix).toString();
    let postFooter = ejs.fileLoader(viewPath + 'footers/post' + ejsSuffix).toString();

    const explainlist = await Dbs.content.categoryPostExplain(currentId);
    if (explainlist.length > 0) {
        postID = explainlist[0].post;
        const ret = await Dbs.content.postFromId(postID);
        if (ret.length > 0) {
            let content = ret[0].content;
            if (content.charAt(0) === '#') {
                content = hmToEjs(content);
                explain = jk + hmInclude + postHeader + content + postFooter;
                let datas = buildData(req, {});
                explain = ejs.render(explain, datas);
                res.send(explain);
            }
        }
    } else {
        res.status(404).end();
    }
};