import { Request, Response } from "express";
import { ejsError, getRootPath, buildData, hmToEjs, viewPath, ejsSuffix } from "../tools";
import { Dbs } from "../db";
import * as ejs from 'ejs';

export async function subjectpost(req: Request, res: Response) {
    let rootPath = getRootPath(req);
    let current = req.params.current;
    let currentId = Number(current);

    let postpage: any[];
    let pageCount: number;
    let pageSize: number = 30;
    pageCount = req.query.pageCount ? parseInt(req.query.pageCount) : 0;
    postpage = await Dbs.content.subjectPost(currentId, pageCount * pageSize, pageSize);
    let subject = await Dbs.content.subjectByid(currentId);

    let nextpage: number = pageCount + 1;
    let prepage: number = pageCount - 1
    let data = buildData(req, {
        nextpage: rootPath + 'morepost/?pageCount=' + nextpage,
        prepage: rootPath + 'morepost/?pageCount=' + prepage,
        path: rootPath + 'post/',
        post: postpage,
        pageCount: pageCount,
        subject: subject
    });

    res.render('subjectpost.ejs', data, (err, html) => {
        if (ejsError(err, res) === true) return;
        res.end(html);
    });
};