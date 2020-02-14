import { Request, Response } from "express";
import * as ejs from 'ejs';
import * as _ from 'lodash';
import { Db } from "../db";
import { isWechat, viewPath, ejsSuffix, getRootPath } from "../tools";

export async function product(req: Request, res:Response) {
    let id = req.params.id;
    const [retProduct, retChemical] = await Promise.all([
        Db.product.execProc('tv_productx', [Db.unit, 0, id]),
        Db.product.tableFromProc('tv_productchemical$query$', [Db.unit, 0, id, null]),
    ]);
    let product = retProduct[0][0];    
    if (!product) {
        res.end('product ' + id + ' not exists!');
        return;
    }
    let packs = retProduct[1];
    let chemical = retChemical[0];
    if (chemical) {
        _.merge(product, chemical);
    }

    await loadAllPropIds(product);

    let template: string, title: string;

    let m = isWechat(req)? '-m' : '';

    let header = ejs.fileLoader(viewPath + 'headers/header' + m + ejsSuffix).toString();
    let homeHeader = ejs.fileLoader(viewPath + 'headers/home-header' + m + ejsSuffix).toString();
    let homeFooter = ejs.fileLoader(viewPath + 'footers/home-footer' + m + ejsSuffix).toString();
    let body = ejs.fileLoader(viewPath + 'product.ejs').toString();

    template = header + homeHeader 
        + '<div class="container my-3">'
        + body
        + '</div>'
        + homeFooter;

    //let content = ejs.fileLoader('./ejs/a.ejs').toString();
    let data = {
        root: getRootPath(req),
        title: undefined,
        product: product,
        packs: packs
    };

    let html = ejs.render(template, data);
    res.end(html);
};

const propDefs = [
    {name: 'brand', proc: 'tv_brand$ids'}
];

async function loadAllPropIds(product: any) {
    let promises:Promise<void>[] = [];
    for (let propDef of propDefs) {
        promises.push(loadPropIds(product, propDef));
    }
    await Promise.all(promises);
}

async function loadPropIds(product: any, propDef: {name:string, proc:string}) {
    let {name: propName, proc} = propDef;
    let ids:any[] = []
    let propColl = {};

    let {id} = product;
    let prop = product[propName];
    let coll = propColl[prop];
    if (coll === undefined) {
        propColl[prop] = coll = [];
        ids.push(prop);
    }

    coll.push(product);
    let ret = await Db.product.tableFromProc(proc, [Db.unit, 0, ids.join(',')]);
    for (let b of ret) {
        let {id} = b;
        let coll = propColl[id];
        if (!coll) continue;
        for (let p of coll) p[propName] = b;
    }
}
