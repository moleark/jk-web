import { Request, Response } from "express";
import * as ejs from 'ejs';
import { tableFromSql } from "../db";

let lastTime: Date = new Date();
let cacheHtml:string;

const db = 'webbuilder$test';

const sqlForWeb = `
SELECT a.id, a.caption, a.discription as disp, c.path as image, a.$update as date
    FROM ${db}.tv_post a 
        left join ${db}.tv_template b on a.template=b.id 
        left join ${db}.tv_image c on a.image=c.id
    ORDER BY a.id desc
    LIMIT 10;
`;

export async function home(req: Request, res:Response) {
    if (false && cacheHtml !== undefined) {
        if (Date.now() - lastTime.getTime() < 3600*1000) {
            res.end(cacheHtml);
            return;
        };
    }
    const ret = await tableFromSql(sqlForWeb);
    //let content = ejs.fileLoader('./ejs/a.ejs').toString();
    let data = {
        path: 'https://c.jkchemical.com/webBuilder/post/',
        news: ret,
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
    };
    res.render('home.ejs', data, (err, html) => {
        res.end(cacheHtml = html);
    });
    //res.end(html);
};
