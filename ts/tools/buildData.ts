import { Request } from "express";
import { Dbs } from "../db";

const root = '/jk-web';
const rootEndSlash = root + '/';

export function getRootPath(req: Request): string {
    let low = req.baseUrl.toLowerCase();
    if (low === root || low.indexOf(rootEndSlash) >= 0) return rootEndSlash;
    return '/';
}

export async function buildData(req: Request, data?: any) {
    if (!data) data = {};
    if (!data.$title) data.$title = '';
    data.$root = getRootPath(req);
    data.shopJsPath = req.app.locals.shopJsPath;
    //获取产品目录树根节点
    const rootcategories = await Dbs.product.getRootCategories();
    data.rootcategories = rootcategories;
    return data;
}
