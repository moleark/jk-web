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
exports.getUserRegisted = void 0;
const node_fetch_1 = require("node-fetch");
/**
 * 根据注册user的id获取其注册信息
 * @param webUserId
 * @returns
 */
function getUserRegisted(webUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield node_fetch_1.default('https://tv.jkchemical.com/tv/open/user-from-id?id=' + webUserId);
        if (res.ok) {
            let content = yield res.json();
            let { ok, res: userInfo } = content;
            if (ok) {
                return userInfo;
            }
        }
    });
}
exports.getUserRegisted = getUserRegisted;
//# sourceMappingURL=getUserRegisted.js.map