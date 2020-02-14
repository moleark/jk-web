import { Request } from "express";

export function device(req: Request):string {
    let userAgent = req.headers['user-agent'];
    if (userAgent.toLowerCase().indexOf('micromessenger')>=0) return 'wechat';
}
