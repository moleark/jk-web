import { Request, Response } from "express";
import * as ejs from 'ejs';
import { Db } from "../db";
import { device, viewPath, ejsSuffix, ipHit, getRootPath, ejsError, buildData } from "../tools";

export async function post(req: Request, res:Response) {
    try {
        let id = req.params.id;
        const ret = await Db.content.postFromId(id);
        let template: string, title: string;
        if (ret.length === 0) {
            template =  `post id=${id} is not defined`;
        }
        else {
            //let m = device(req)? '-m' : '';

            let header = ejs.fileLoader(viewPath + 'headers/header' + ejsSuffix).toString();
            let homeHeader = ejs.fileLoader(viewPath + 'headers/home-header' + ejsSuffix).toString();
            let homeFooter = ejs.fileLoader(viewPath + 'footers/home-footer' + ejsSuffix).toString();
                
            template = header + homeHeader 
                + '<div class="container my-3">'
                + ret[0].content
                + '</div>'
                + homeFooter;
            title = ret[0].caption;
        }
        let data = buildData(req, undefined);
        let html = ejs.render(template, data);
        res.end(html);

        ipHit(req, id);
    }
    catch (e) {
        ejsError(e, res);
    }

    /*
    res.render('post.ejs', data, (err, html) => {
        if (ejsError(err, res) === true) return;
        res.end(html);
    });
    */
};

