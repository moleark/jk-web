import { Request, Response } from "express";
import { Db } from "../db";
import { categories, productNews, newsletter, latestProducts } from "../data";
import { ejsError } from "../tools";

let lastTime: Date = new Date();
let cacheHtml:string;
//测试
export async function home(req: Request, res:Response) {
    if (false && cacheHtml !== undefined) {
        if (Date.now() - lastTime.getTime() < 3600*1000) {
            res.end(cacheHtml);
            return;
        };
    }
    const ret = await Db.content.homePostList();
    //let content = ejs.fileLoader('./ejs/a.ejs').toString();
    let data = {
        title: undefined,
        path: 'post/', // 'https://c.jkchemical.com/webBuilder/post/',
        news: ret,
        categories: categories,
        productNews: productNews,
        newsletter: newsletter,
        latestProducts: latestProducts,

    };
    res.render('home.ejs', data, (err, html) => {
        if (ejsError(err, res) === true) return;
        res.end(cacheHtml = html);
    });
};
