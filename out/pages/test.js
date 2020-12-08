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
exports.test = void 0;
const ejs = require("ejs");
const tools_1 = require("../tools");
const tools_2 = require("../tools");
function test(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let data = tools_1.buildData(req, undefined);
            let header = ejs.fileLoader(tools_2.viewPath + 'headers/header' + tools_2.ejsSuffix).toString();
            let jk = ejs.fileLoader(tools_2.viewPath + '/headers/jk' + tools_2.ejsSuffix).toString();
            let hmInclude = ejs.fileLoader(tools_2.viewPath + '/headers/hm' + tools_2.ejsSuffix).toString();
            let homeHeader = ejs.fileLoader(tools_2.viewPath + 'headers/home-header' + tools_2.ejsSuffix).toString();
            let postHeader = ejs.fileLoader(tools_2.viewPath + 'post/post-header' + tools_2.ejsSuffix).toString();
            let postAttachProduct = ejs.fileLoader(tools_2.viewPath + 'post/post-attachproduct' + tools_2.ejsSuffix).toString();
            let postFooter = ejs.fileLoader(tools_2.viewPath + 'post/post-footer' + tools_2.ejsSuffix).toString();
            let homeFooter = ejs.fileLoader(tools_2.viewPath + 'footers/home-footer' + tools_2.ejsSuffix).toString();
            let reqPath = req.path.toLowerCase();
            if (reqPath.endsWith('/') === true) {
                reqPath += 'index';
            }
            else if (reqPath === '/test') {
                reqPath += '/index';
            }
            let body = ejs.fileLoader(tools_2.viewPath + reqPath + '.ejs').toString();
            if (body.charAt(0) === '#') {
                tools_1.hmParse(body);
                body = tools_1.hmToEjs(body);
            }
            let html = ejs.render(header
                + jk
                + hmInclude
                + homeHeader
                + postHeader
                + body
                + postAttachProduct
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
exports.test = test;
;
//# sourceMappingURL=test.js.map