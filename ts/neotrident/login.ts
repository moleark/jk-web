import { Request, Response } from "express";
import { Dbs } from "../db";
import * as config from 'config';
import { v4 as uuidv4 } from 'uuid';
import { getUserRegisted } from "../tools/getUserRegisted";

export async function login(req: Request, res: Response) {

    let { query } = req;
    let { key } = query;
    if (!key) {
        res.redirect("/login");
        return;
    }

    let { jointPlatform: jointPlatform } = Dbs;
    let neoUser = await jointPlatform.getUserByLoginKey(key);
    if (!neoUser) {
        res.redirect("/login");
        return;
    }

    let token = uuidv4();
    let { webUser, password, username } = neoUser;
    let userInfo = await getUserRegisted(webUser);
    if (userInfo) {
        let success = await jointPlatform.saveLoginReq(token, userInfo.name, password, username);
        // 导航到默认界面
        if (success) {
            let jointOptions = config.get<any>('joint');
            let { loginSuccessRedirect } = jointOptions;
            res.redirect(loginSuccessRedirect + "?lgtk=" + token);
            return;
        }
    }
}