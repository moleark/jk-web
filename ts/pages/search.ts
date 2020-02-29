import { Request, Response } from "express";
import * as ejs from 'ejs';
import * as _ from 'lodash';
import { Dbs, Db } from "../db";
import { device, viewPath, ejsSuffix, buildData, getRootPath } from "../tools";

export async function search(req: Request, res: Response) {
    let rootPath = getRootPath(req);
    let key = req.params.key;
    
    // if (key) key = req.query.key;
    
    let dbs = Dbs;
    let pageCount: number = 0;
    let pageSize: number = 5;
    pageCount = req.query.pageCount ? parseInt(req.query.pageCount) : 0;

    const ret = await dbs.product.searchProductByKey(key, pageCount * pageSize, pageSize);
    let products: any[] = ret;
    await loadAllPropIds(products);

    let template: string, title: string;

    let header = ejs.fileLoader(viewPath + 'headers/header' + ejsSuffix).toString();
    let homeHeader = ejs.fileLoader(viewPath + 'headers/home-header' + ejsSuffix).toString();
    let homeFooter = ejs.fileLoader(viewPath + 'footers/home-footer' + ejsSuffix).toString();
    let body = ejs.fileLoader(viewPath + 'search.ejs').toString();

    template = header + homeHeader
        + '<div class="container my-3">'
        + body
        + '</div>'
        + homeFooter;
    let nextpage: number = pageCount + 1;
    let prepage: number = pageCount - 1;
    let data = buildData(req, {
        nextpage: rootPath + 'search/'+ key +'/?pageCount=' + nextpage,
        prepage: rootPath + 'search/'+ key +'/?pageCount=' + prepage,
        products: products,
        pageCount: pageCount,
    });

    let html = ejs.render(template, data);
    res.end(html);
};

async function loadAllPropIds(products: any[]) {
    const propDefs = [
        { name: 'brand', proc: 'tv_brand$ids', db: Dbs.product }
    ];

    let promises: Promise<void>[] = [];
    for (let propDef of propDefs) {
        promises.push(loadPropIds(products, propDef));
    }
    await Promise.all(promises);
}

async function loadPropIds(products: any[], propDef: { name: string, proc: string, db: Db }) {
    let { name: propName, proc, db } = propDef;
    let ids: any[] = []
    let propColl = {};
    for (let product of products) {
        let { id } = product;
        let prop = product[propName];
        if (!prop) continue;
        let coll = propColl[prop];
        if (coll === undefined) {
            propColl[prop] = coll = [];
            ids.push(prop);
        }
        coll.push(product);
    }
    if (ids.length === 0) return;
    let text = ids.join(',');
    let ret = await Dbs.product.tableFromProc(proc, [Dbs.unit, 0, text]);
    for (let b of ret) {
        let { id } = b;
        let coll = propColl[id];
        if (!coll) continue;
        for (let p of coll) p[propName] = b;
    }
}