import { Request, Response } from "express";
import * as ejs from 'ejs';
import { tableFromSql } from "../db";
import { sql } from '../sql';
//import { ejsError } from "../tools";


export async function post(req: Request, res:Response) {
    let id = req.params.id;
    const ret = await tableFromSql(sql.postFromId, [id]);
    let template: string, title: string;
    if (ret.length === 0) {
        template =  `post id=${id} is not defined`;
    }
    else {
        let header = ejs.fileLoader('./public/views/headers/home-header.ejs').toString();
        let footer = ejs.fileLoader('./public/views/footers/home-footer.ejs').toString();
        template = header 
            + '<div class="container my-3">'
            + ret[0].content
            + footer;
        title = ret[0].caption;
    }
    //let content = ejs.fileLoader('./ejs/a.ejs').toString();
    let data = {
        title: title,
        //path: 'post/'  'https://c.jkchemical.com/webBuilder/post/',
        //content: content,
    };

    let html = ejs.render(template, data);
    res.end(html);

    /*
    res.render('post.ejs', data, (err, html) => {
        if (ejsError(err, res) === true) return;
        res.end(html);
    });
    */
};

