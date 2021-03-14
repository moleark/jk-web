import { Request, Response } from "express";
import { ejsError, getRootPath, buildData, hmToEjs, viewPath, ejsSuffix } from "../tools";
import { Dbs } from "../db";
import { renderPostArticle } from "./post";

export async function category(req: Request, res: Response) {
    let current = req.params.current;
    let currentId = Number(current);
    let category = await Dbs.product.getCategoryById(currentId);
    if (!category) {
        res.status(404).end();
        return;
    }

    let children = await Dbs.product.getChildrenCategories(currentId);
    category.children = children;

    const categoryPost = await Dbs.content.categoryPost(currentId);

    let postArticle: string = "";
    const explainlist = await Dbs.content.getCategoryInstruction(currentId);
    if (explainlist.length > 0) {
        let postID = explainlist[0].post;
        const ret = await Dbs.content.postFromId(postID);
        if (ret.length > 0) {
            postArticle = await renderPostArticle(req, ret[0]);
        }
    }

    let rootPath = getRootPath(req);
    let data = await buildData(req, {
        current: current,
        category: category,
        postArticle: postArticle,
        categoryPost: categoryPost,
        path: rootPath + 'product-catalog/',
        productPath: rootPath + 'product-catalog/',
        postpath: rootPath + 'post/',
        titleshow: true
    });

    res.render('category.ejs', data, (err, html) => {
        if (ejsError(err, res) === true) return;
        res.end(html);
    });
};