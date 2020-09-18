import { Request, Response } from "express";
import { buildData, hmToEjs, viewPath, ejsSuffix } from "../tools";
import { Dbs } from "../db";
import * as ejs from 'ejs';

export async function pointProductDetail(req: Request, res: Response) {
    let current = req.params.current;
    let currentId = Number(current);

    let detailContent: string = "";
    let jk = ejs.fileLoader(viewPath + '/headers/jk' + ejsSuffix).toString();
    let hmInclude = ejs.fileLoader(viewPath + '/headers/hm' + ejsSuffix).toString();
    let postHeader = ejs.fileLoader(viewPath + 'headers/post' + ejsSuffix).toString();
    let postFooter = ejs.fileLoader(viewPath + 'footers/post' + ejsSuffix).toString();

    const pointProductDetail = await Dbs.pointshop.categoryPostExplain(currentId);
    if (pointProductDetail.length > 0) {
        let content = pointProductDetail[0].content;
        if (content.charAt(0) === '#') {
            content = hmToEjs(content);
            detailContent = jk + hmInclude + postHeader + content + postFooter;
            let datas = buildData(req, {});
            detailContent = ejs.render(detailContent, datas);
            res.send(detailContent);
        }
    } else {
        res.status(404).end();
    }
    res.status(404).end();
};