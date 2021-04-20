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

    const pointProductDetail = await Dbs.pointshop.getPointProductDetail(currentId);
    if (pointProductDetail.length > 0) {
        let content = pointProductDetail[0].content;
        content = hmToEjs(content);
        detailContent = jk + hmInclude + content;
        let datas = await buildData(req);
        detailContent = ejs.render(detailContent, datas);
        res.send(detailContent);
    } else {
        res.status(404).end();
    }
};