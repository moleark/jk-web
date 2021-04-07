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
const config_1 = require("config");
const node_fetch_1 = require("node-fetch");
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let { query } = req;
        let { account, onlyCode } = query;
        if (!account || !onlyCode) {
            res.redirect("/login");
            return;
        }
        let epecUser = yield db_1.Dbs.jointPlatform.getUserByName(account);
        if (!epecUser) {
            res.redirect("/login");
            return;
        }
        // 调用epec接口验证
        let epecOptions = config_1.default.get('epec');
        let { epec_loginCallBack, epec_loginSuccessRedirect } = epecOptions;
        let response = yield node_fetch_1.default(epec_loginCallBack);
        if (response.ok) {
            let content = yield response.json();
            if (content.result) {
                // OK
                // 记录此次登录请求，并使用此登录请求的id实现在客户端的再次验证
                // 导航到默认界面
                res.redirect(epec_loginSuccessRedirect + "?token=");
            }
        }
        res.redirect("/login");
    });
}
exports.login = login;
//# sourceMappingURL=login.js.map