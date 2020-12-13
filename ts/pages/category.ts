import { Request, Response } from "express";
import { ejsError, getRootPath, buildData, hmToEjs, viewPath, ejsSuffix } from "../tools";
import { Dbs } from "../db";
import * as ejs from 'ejs';
import { renderPostArticle } from "./post";

export async function category(req: Request, res: Response) {
    let rootPath = getRootPath(req);
    let current = req.params.current;
    let currentId = Number(current);
    let rootcategories = await Dbs.product.getRootCategories();
    let category = await Dbs.product.getCategoryById(currentId);
    let children = await Dbs.product.getChildrenCategories(currentId);
    category.children = children;

    const categoryPost = await Dbs.content.categoryPost(currentId);

    let explain: string = "", postArticle: string = '';
    const explainlist = await Dbs.content.categoryPostExplain(currentId);
    if (explainlist.length > 0) {
        let postID = explainlist[0].post;
        const ret = await Dbs.content.postFromId(postID);
        if (ret.length > 0) {
            postArticle = ret[0];
            explain = await renderPostArticle(req, postArticle);
        }
    }

    let productpage: any[];
    let pageCount: number = 0;
    let pageSize: number = 30;

    productpage = await Dbs.product.searchProductByCategory(currentId, pageCount * pageSize, pageSize);

    let data = buildData(req, {
        rootcategories: rootcategories,
        current: current,
        category: category,
        postArticle: postArticle,
        content: explain,
        categoryPost: categoryPost,
        path: rootPath + 'category/',
        productPath: rootPath + 'productCategory/',
        postpath: rootPath + 'post/',
        titleshow: true

    });

    res.render('category.ejs', data, (err, html) => {
        if (ejsError(err, res) === true) return;
        res.end(html);
    });
};