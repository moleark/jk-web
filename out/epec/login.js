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
const node_fetch_1 = require("node-fetch");
const uuid_1 = require("uuid");
const getUserRegisted_1 = require("../tools/getUserRegisted");
const https = require("https");
const logger_1 = require("./logger");
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let { originalUrl, query } = req;
        logger_1.epecLogger.debug(originalUrl);
        let { account, onlyCode } = query;
        if (!account || !onlyCode) {
            res.redirect("/login");
            return;
        }
        let { jointPlatform } = db_1.Dbs;
        let epecUser = yield jointPlatform.getUserByName(account);
        if (!epecUser) {
            logger_1.epecLogger.warn('epec login account %s does not exits.', account);
            res.redirect("/login");
            return;
        }
        logger_1.epecLogger.debug('epec  epecUser: ', epecUser);
        // 调用epec接口验证
        let epecOptions = config.get('epec');
        let { epec_loginCallBack, epec_loginSuccessRedirect } = epecOptions;
        try {
            let response = yield node_fetch_1.default(epec_loginCallBack + `?account=${account}&onlyCode=${onlyCode}`, {
                method: 'GET',
                headers: { "Content-Type": "application/json" },
                agent: new https.Agent({ rejectUnauthorized: false })
            });
            logger_1.epecLogger.debug('epec login call back status', response.status);
            if (response.ok) {
                let content = yield response.json();
                logger_1.epecLogger.debug('epec login call back content: ', content);
                if (content.result) {
                    // OK
                    // 记录此次登录请求，并使用此登录请求的id实现在客户端的再次验证
                    let token = uuid_1.v4();
                    let { webUser, password, username } = epecUser;
                    let userInfo = yield getUserRegisted_1.getUserRegisted(webUser);
                    logger_1.epecLogger.debug('epec getUserRegisted userInfo: ', userInfo, token);
                    if (userInfo) {
                        let success = yield jointPlatform.saveLoginReq(token, userInfo.name, password, username);
                        // 导航到默认界面
                        if (success) {
                            logger_1.epecLogger.debug('epec redirect : ', epec_loginSuccessRedirect + "?lgtk=" + token);
                            res.redirect(epec_loginSuccessRedirect + "?lgtk=" + token);
                            return;
                        }
                    }
                }
            }
            else {
                logger_1.epecLogger.error('epec login call back response status error: ', response.status);
            }
        }
        catch (error) {
            logger_1.epecLogger.error('epec login call back error: ', error);
        }
        res.redirect("/login");
    });
}
exports.login = login;
//# sourceMappingURL=login.js.map