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
exports.clientLogin = void 0;
const db_1 = require("../db");
/**
 *
 * @param req
 * @param res
 */
function clientLogin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let { query } = req;
        let { lgtk } = query;
        if (lgtk) {
            let { jointPlatform: jointPlatform } = db_1.Dbs;
            let loginReq = yield jointPlatform.getLoginReq(lgtk);
            if (loginReq) {
                res.json({ user: loginReq.myUsername, password: loginReq.password });
                return;
            }
        }
        res.status(404).end();
    });
}
exports.clientLogin = clientLogin;
//# sourceMappingURL=clientLogin.js.map