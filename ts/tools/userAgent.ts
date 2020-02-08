import { Request } from "express";

export function isWechat(req: Request) {
    let userAgent = req.headers['user-agent'];
    return userAgent.toLowerCase().indexOf('micromessenger')>=0;
}
