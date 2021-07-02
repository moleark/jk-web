import { Request, Response } from "express";
import { Dbs } from "../db";
import * as config from 'config';
import { v4 as uuidv4 } from 'uuid';
import { getUserRegisted } from "../tools/getUserRegisted";

export async function login(req: Request, res: Response) {

    let { query } = req;
    let { key } = query;
    if (!key) {
        return res.status(404).redirect("/login");
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

            // 诺华
            if (key == "FEF7A870-35FE-4723-A563-DE8CA890AADF") {
                let { punchout_loginSuccessRedirect } = config.get('punchout');
                return res.redirect(punchout_loginSuccessRedirect + "?lgtk=" + token);
            }
            else {
                let { loginSuccessRedirect } = config.get('joint');
                return res.redirect(loginSuccessRedirect + "?lgtk=" + token);
            }
        }
    }
}