import { Request, Response } from "express";
import { Dbs } from "../db";
import config from 'config';
import fetch from "node-fetch";

export async function login(req: Request, res: Response) {

    let { query } = req;
    let { account, onlyCode } = query;
    if (!account || !onlyCode) {
        res.redirect("/login");
        return;
    }

    let epecUser = await Dbs.jointPlatform.getUserByName(account);
    if (!epecUser) {
        res.redirect("/login");
        return;
    }

    // 调用epec接口验证
    let epecOptions = config.get<any>('epec');
    let { epec_loginCallBack, epec_loginSuccessRedirect } = epecOptions;
    let response = await fetch(epec_loginCallBack);
    if (response.ok) {
        let content = await response.json();
        if (content.result) {
            // OK

            // 记录此次登录请求，并使用此登录请求的id实现在客户端的再次验证

            // 导航到默认界面
            res.redirect(epec_loginSuccessRedirect + "?token=");
        }
    }
    res.redirect("/login");
}