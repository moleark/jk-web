import { Request, Response } from "express";
import { Dbs } from "../db";
import * as config from 'config';
import fetch from "node-fetch";
import { v4 as uuidv4 } from 'uuid';
import { getUserRegisted } from "../tools/getUserRegisted";

export async function login(req: Request, res: Response) {

    let { query } = req;
    let { account, onlyCode } = query;
    if (!account || !onlyCode) {
        res.redirect("/login");
        return;
    }

    let { jointPlatform } = Dbs;
    let epecUser = await jointPlatform.getUserByName(account);
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
            let token = uuidv4();
            let { webUser, password, username } = epecUser;
            let userInfo = await getUserRegisted(webUser);
            if (userInfo) {
                let success = await jointPlatform.saveLoginReq(token, userInfo.name, password, username);
                // 导航到默认界面
                if (success) {
                    res.redirect(epec_loginSuccessRedirect + "?lgtk=" + token);
                    return;
                }
            }
        }
    }
    res.redirect("/login");
}