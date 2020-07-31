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
function page(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let id = req.params.id;
            let pagename = req.path.substring(1, req.path.length);
            const ret = yield db_1.Dbs.content.getPage(pagename);
            let template, title;
            //获取产品目录树根节点
            const rootcategories = yield db_1.Dbs.product.getRootCategories();
            //获取栏目
            let subject;
            subject = yield db_1.Dbs.content.getSubject();
            if (ret.length === 0) {
                template = `post id=${id} is not defined`;
            }
            else {
                let header = ejs.fileLoader(tools_1.viewPath + 'headers/header' + tools_1.ejsSuffix).toString();
                let jk = ejs.fileLoader(tools_1.viewPath + '/headers/jk' + tools_1.ejsSuffix).toString();
                let hmInclude = ejs.fileLoader(tools_1.viewPath + '/headers/hm' + tools_1.ejsSuffix).toString();
                let homeHeader = ejs.fileLoader(tools_1.viewPath + 'headers/home-header' + tools_1.ejsSuffix).toString();
                let homeFooter = ejs.fileLoader(tools_1.viewPath + 'footers/home-footer' + tools_1.ejsSuffix).toString();
                let bodys = "";
                ret.forEach(element => {
                    let body = element.content;
                    if (body.charAt(0) === '#') {
                        body = tools_1.hmToEjs(body);
                    }
                    bodys += body;
                });
                template = header
                    + jk
                    + hmInclude
                    + homeHeader
                    + bodys
                    + homeFooter;
                title = ret[0].caption;
            }
            let data = tools_1.buildData(req, { $title: title, rootcategories: rootcategories, titleshow: true });
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