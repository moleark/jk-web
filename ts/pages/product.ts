import { Request, Response } from "express";
import * as ejs from 'ejs';
import * as _ from 'lodash';
import { Dbs } from "../db";
import { device, viewPath, ejsSuffix, buildData } from "../tools";

/**
 * 渲染单个产品（已不再使用，有jk-cart替换） 
 * @param req 
 * @param res 
 * @returns 
 */
export async function product(req: Request, res: Response) {
    let id = req.params.id;
    const [retProduct, retChemical] = await Promise.all([
        Dbs.product.execProc('tv_productx', [Dbs.unit, 0, id]),
        Dbs.product.tableFromProc('tv_productchemical$query$', [Dbs.unit, 0, id, null]),
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

    //let template: string, title: string;

    //let m = device(req)? '-m' : '';

    let header = ejs.fileLoader(viewPath + 'headers/header' + ejsSuffix).toString();
    let homeHeader = ejs.fileLoader(viewPath + 'headers/home-header' + ejsSuffix).toString();
    let homeFooter = ejs.fileLoader(viewPath + 'footers/home-footer' + ejsSuffix).toString();
    let body = ejs.fileLoader(viewPath + 'product.ejs').toString();

    let template = header + homeHeader
        + '<div class="container my-3">'
        + body
        + '</div>'
        + homeFooter;

    let data = await buildData(req, {
        product: product,
        packs: packs
    });

    let html = ejs.render(template, data);
    res.end(html);
};

const propDefs = [
    { name: 'brand', proc: 'tv_brand$ids' }
];

async function loadAllPropIds(product: any) {
    let promises: Promise<void>[] = [];
    for (let propDef of propDefs) {
        promises.push(loadPropIds(product, propDef));
    }
    await Promise.all(promises);
}

async function loadPropIds(product: any, propDef: { name: string, proc: string }) {
    let { name: propName, proc } = propDef;
    let ids: any[] = []
    let propColl = {};

    let { id } = product;
    let prop = product[propName];
    let coll = propColl[prop];
    if (coll === undefined) {
        propColl[prop] = coll = [];
        ids.push(prop);
    }

    coll.push(product);
    let ret = await Dbs.product.tableFromProc(proc, [Dbs.unit, 0, ids.join(',')]);
    for (let b of ret) {
        let { id } = b;
        let coll = propColl[id];
        if (!coll) continue;
        for (let p of coll) p[propName] = b;
    }
}
