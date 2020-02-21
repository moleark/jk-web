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
const ejs = require("ejs");
const db_1 = require("../db");
const tools_1 = require("../tools");
function morepost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let rootPath = tools_1.getRootPath(req);
        let postpage;
        let pageCount;
        let pageSize = 30;
        try {
            pageCount = req.query.pageCount ? req.query.pageCount : 0;
            postpage = yield db_1.Dbs.content.morePostPage(pageCount * pageSize, pageSize);
            let header = ejs.fileLoader(tools_1.viewPath + 'headers/header' + tools_1.ejsSuffix).toString();
            let jk = ejs.fileLoader(tools_1.viewPath + '/headers/jk' + tools_1.ejsSuffix).toString();
            let hmInclude = ejs.fileLoader(tools_1.viewPath + '/headers/hm' + tools_1.ejsSuffix).toString();
            let homeHeader = ejs.fileLoader(tools_1.viewPath + 'headers/home-header' + tools_1.ejsSuffix).toString();
            let postHeader = ejs.fileLoader(tools_1.viewPath + 'headers/post' + tools_1.ejsSuffix).toString();
            let postFooter = ejs.fileLoader(tools_1.viewPath + 'footers/post' + tools_1.ejsSuffix).toString();
            let homeFooter = ejs.fileLoader(tools_1.viewPath + 'footers/home-footer' + tools_1.ejsSuffix).toString();
            let body = ejs.fileLoader(tools_1.viewPath + 'morepost.ejs').toString();
            let data = tools_1.buildData(req, {
                nextpage: rootPath + 'morepost/?pageCount=' + (pageCount + 1),
                prepage: rootPath + 'morepost/?pageCount=' + (pageCount - 1),
                path: rootPath + 'post/',
                post: postpage,
            });
            let html = ejs.render(header
                + jk
                + hmInclude
                + homeHeader
                + postHeader
                + body
                + postFooter
                + homeFooter, data);
            res.end(html);
        }
        catch (err) {
            console.error(err);
            res.end('error in parsing: ' + err.message);
        }
    });
}
exports.morepost = morepost;
;
//# sourceMappingURL=morepost.js.map