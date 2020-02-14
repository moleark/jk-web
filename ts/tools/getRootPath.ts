import { Request } from "express";

const root = '/jk-web';
const rootEndSlash = root + '/';

export function getRootPath(req: Request): string {
    let low = req.baseUrl.toLowerCase();
    if (low === root || low.indexOf(rootEndSlash)>=0) return rootEndSlash;
    return '/';
}
