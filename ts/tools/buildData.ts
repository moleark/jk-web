import { Request } from "express";

const root = '/jk-web';
const rootEndSlash = root + '/';

export function getRootPath(req: Request): string {
    let low = req.baseUrl.toLowerCase();
    if (low === root || low.indexOf(rootEndSlash) >= 0) return rootEndSlash;
    return '/';
}

export function buildData(req: Request, data: any) {
    if (!data) data = {};
    if (!data.$title) data.$title = '';
    data.$root = getRootPath(req);
    data.shopJsPath = req.app.locals.shopJsPath;
    return data;
}
