import { Request, Response } from "express";
import { tableFromSql } from "../db";
import { sql } from '../sql';

export async function post(req: Request, res:Response) {
    let id = req.params.id;
    const ret = await tableFromSql(sql.postFromId, [id]);
    let content: string;
    if (ret.length === 0) {
        content =  `post id=${id} is not defined`;
    }
    else {
        content = ret[0].content;
    }
    //let content = ejs.fileLoader('./ejs/a.ejs').toString();
    let data = {
        //path: 'post/'  'https://c.jkchemical.com/webBuilder/post/',
        content: content,
    };
    res.render('post.ejs', data, (err, html) => {
        res.end(html);
    });
};

