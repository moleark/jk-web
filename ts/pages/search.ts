import { Request, Response } from "express";
import * as ejs from 'ejs';
import * as _ from 'lodash';
import { Db } from "../db";
import { isWechat, viewPath, ejsSuffix } from "../tools";

export async function search(req: Request, res:Response) {
    let key = req.params.key;
    if (!key) key = req.query.key;
    const ret = await Db.product.execProc('tv_searchproduct', [Db.unit, 0, null, 30, key, 4]);
    let products:any[] = ret[0];
    await loadAllPropIds(products);

    let template: string, title: string;

    let m = isWechat(req)? '-m' : '';

    let header = ejs.fileLoader(viewPath + 'headers/header' + m + ejsSuffix).toString();
    let homeHeader = ejs.fileLoader(viewPath + 'headers/home-header' + m + ejsSuffix).toString();
    let homeFooter = ejs.fileLoader(viewPath + 'footers/home-footer' + m + ejsSuffix).toString();
    let body = ejs.fileLoader(viewPath + 'search.ejs').toString();
        
    template = header + homeHeader 
        + '<div class="container my-3">'
        + body
        + '</div>'
        + homeFooter;

    //let content = ejs.fileLoader('./ejs/a.ejs').toString();
    let data = {
        title: undefined,
        products: products,
        //path: 'post/'  'https://c.jkchemical.com/webBuilder/post/',
        //content: content,
    };

    let html = ejs.render(template, data);
    res.end(html);
};

const propDefs = [
    {name: 'brand', proc: 'tv_brand$ids'}
];

async function loadAllPropIds(products: any[]) {
    let promises:Promise<void>[] = [];
    for (let propDef of propDefs) {
        promises.push(loadPropIds(products, propDef));
    }
    await Promise.all(promises);
}

async function loadPropIds(products: any[], propDef: {name:string, proc:string}) {
    let {name: propName, proc} = propDef;
    let ids:any[] = []
    let propColl = {};
    for (let product of products) {
        let {id} = product;
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
    let ret = await Db.product.tableFromProc(proc, [Db.unit, 0, text]);
    for (let b of ret) {
        let {id} = b;
        let coll = propColl[id];
        if (!coll) continue;
        for (let p of coll) p[propName] = b;
    }
}