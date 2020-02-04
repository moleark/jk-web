import { Request, Response } from "express";
import { tableFromSql } from "../db";
import { sql } from '../sql';
import { categories, productNews, newsletter } from "../data";
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
    const ret = await tableFromSql(sql.homePostList);
    //let content = ejs.fileLoader('./ejs/a.ejs').toString();
    let data = {
        title: undefined,
        path: 'post/', // 'https://c.jkchemical.com/webBuilder/post/',
        news: ret,
        categories: categories,
        productNews: productNews,
        newsletter: newsletter,

    };
    res.render('home.ejs', data, (err, html) => {
        if (ejsError(err, res) === true) return;
        res.end(cacheHtml = html);
    });
};

/*
news: [
    {
        caption: '学霸装备，开学Let\'s购',
        disp: '好玩的，好看的，流行的，包你喜欢',
        date: new Date(),
        by: '王写手',
    },
    {
        caption: '好多人都开始用免液体试验管了',
        disp: '免液体试验管，不怕破，不怕裂，经打，经摔！',
        date: new Date(),
        by: '张主编',
    },
    {
        caption: '编说法不容易，编稿费优先',
        disp: '当互联网写手可是不容易，不是我的长项',
        date: new Date(),
        by: 'Henry',
    },
    {
        caption: '贴图标题更诱人，可是我不会',
        disp: '有闲空的时候，可以排版加图片。这会儿实在忙，就凑合了',
        date: new Date(),
        by: 'Henry',
    },
    {
        caption: '震撼发布，最新产品----灭菌效果99.9999%',
        disp: '来一个好玩的段子。点击进来看看，来看看。什么内容也没有！',
        date: new Date(),
        by: '瞎编的，哈哈',
    }
],
*/
