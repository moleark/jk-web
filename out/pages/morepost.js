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
const db_1 = require("../db");
const tools_1 = require("../tools");
function morepost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let rootPath = tools_1.getRootPath(req);
        let postpage;
        let pageCount;
        let pageSize = 30;
        try {
            pageCount = req.query.pageCount ? parseInt(req.query.pageCount) : 0;
            postpage = yield db_1.Dbs.content.morePostPage(pageCount * pageSize, pageSize);
            /*
            let header = ejs.fileLoader(viewPath + 'headers/header' + ejsSuffix).toString();
            let jk = ejs.fileLoader(viewPath + '/headers/jk' + ejsSuffix).toString();
            let hmInclude = ejs.fileLoader(viewPath + '/headers/hm' + ejsSuffix).toString();
            let homeHeader = ejs.fileLoader(viewPath + 'headers/home-header' + ejsSuffix).toString();
            let postHeader = ejs.fileLoader(viewPath + 'headers/post' + ejsSuffix).toString();
    
            let postFooter = ejs.fileLoader(viewPath + 'footers/post' + ejsSuffix).toString();
            let homeFooter = ejs.fileLoader(viewPath + 'footers/home-footer' + ejsSuffix).toString();
            let body = ejs.fileLoader(viewPath + 'morepost.ejs').toString();
            */
            let nextpage = pageCount + 1;
            let prepage = pageCount - 1;
            let data = tools_1.buildData(req, {
                nextpage: rootPath + 'morepost/?pageCount=' + nextpage,
                prepage: rootPath + 'morepost/?pageCount=' + prepage,
                path: rootPath + 'post/',
                post: postpage,
                pageCount: pageCount
            });
            console.log(nextpage, 'nextpage');
            /*
            let html = ejs.render(
                header
                + jk
                + hmInclude
                + homeHeader
                + postHeader
                + body
                + postFooter
                + homeFooter
                , data);
            res.end(html);
            */
            res.render('morepost.ejs', data, (err, html) => {
                if (tools_1.ejsError(err, res) === true)
                    return;
                res.end(html);
            });
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