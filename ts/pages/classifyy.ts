import { Request, Response } from "express";
import { categories } from "../data";
import { ejsError, getRootPath } from "../tools";
import { buildData } from "../tools";

export async function classifyy(req: Request, res:Response) {
    let index = req.params.index;
    let current = req.params.current;
    // let rootPath = getRootPath(req);
    // console.log(rootPath,'curr')
    let data = buildData(req, {
        title: categories[current].caption,
        index: index,
        current:current,
        categories: categories,
    });
    res.render('classifyy.ejs',data, (err, html) => {
        if (ejsError(err, res) === true) return;
        res.end(html);
    });
};

