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
exports.page = void 0;
const db_1 = require("../db");
const tools_1 = require("../tools");
const ejs = require("ejs");
const post_1 = require("./post");
function page(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ret = yield db_1.Dbs.content.getPage(req.path);
            if (ret.length === 0) {
                res.status(404);
                next();
                return;
            }
            let template, title, postArticleHtml;
            let { post, url } = ret[0];
            let postret = yield db_1.Dbs.content.postFromId(post);
            if (postret.length > 0) {
                postArticleHtml = yield post_1.renderPostContent(req, postret[0]);
            }
            /*
            let bodys: any = "";
            ret.forEach(element => {
                let body = element.content;
                if (body.charAt(0) === '#') {
                    body = hmToEjs(body);
                }
                bodys += body;
            });
            */
            let header = ejs.fileLoader(tools_1.viewPath + 'headers/header' + tools_1.ejsSuffix).toString();
            let homeHeader = ejs.fileLoader(tools_1.viewPath + 'headers/home-header' + tools_1.ejsSuffix).toString();
            let homeFooter = ejs.fileLoader(tools_1.viewPath + 'footers/home-footer' + tools_1.ejsSuffix).toString();
            template = header
                + homeHeader
                + postArticleHtml
                + homeFooter;
            title = ret[0].caption;
            let data = yield tools_1.buildData(req, {
                $title: title, titleshow: true
            });
            let html = ejs.render(template, data);
            res.end(html);
        }
        catch (e) {
            tools_1.ejsError(e, res);
        }
    });
}
exports.page = page;
;
//# sourceMappingURL=page.js.map