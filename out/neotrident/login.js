"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const db_1 = require("../db");
const config = require("config");
const uuid_1 = require("uuid");
const getUserRegisted_1 = require("../tools/getUserRegisted");
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let { query } = req;
        let { key } = query;
        if (!key) {
            return res.status(404).redirect("/login");
        }
        let { jointPlatform: jointPlatform } = db_1.Dbs;
        let neoUser = yield jointPlatform.getUserByLoginKey(key);
        if (!neoUser) {
            res.redirect("/login");
            return;
        }
        let token = uuid_1.v4();
        let { webUser, password, username } = neoUser;
        let userInfo = yield getUserRegisted_1.getUserRegisted(webUser);
        if (userInfo) {
            let success = yield jointPlatform.saveLoginReq(token, userInfo.name, password, username);
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
    });
}
exports.login = login;
//# sourceMappingURL=login.js.map