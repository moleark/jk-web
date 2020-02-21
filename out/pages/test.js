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
const tools_1 = require("../tools");
const tools_2 = require("../tools");
function test(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            tools_1.hm(`#t0	a
一个实验小白，轻松掌控3个搅拌实验的奥秘
		
#[ border bg-light p-5 rounded mx-5

#p	c
您有过这种经历吗？

#p	c
实验无进展，论文未发表，导师催得紧，着急……<img src="https://c.jkchemical.com/res/0-0802.png"/>

#]
				`);
            let data = tools_1.buildData(req, undefined);
            let header = ejs.fileLoader(tools_2.viewPath + 'headers/header' + tools_2.ejsSuffix).toString();
            let jk = ejs.fileLoader(tools_2.viewPath + '/headers/jk' + tools_2.ejsSuffix).toString();
            let hmInclude = ejs.fileLoader(tools_2.viewPath + '/headers/hm' + tools_2.ejsSuffix).toString();
            let homeHeader = ejs.fileLoader(tools_2.viewPath + 'headers/home-header' + tools_2.ejsSuffix).toString();
            let postHeader = ejs.fileLoader(tools_2.viewPath + 'headers/post' + tools_2.ejsSuffix).toString();
            let postFooter = ejs.fileLoader(tools_2.viewPath + 'footers/post' + tools_2.ejsSuffix).toString();
            let homeFooter = ejs.fileLoader(tools_2.viewPath + 'footers/home-footer' + tools_2.ejsSuffix).toString();
            let body = ejs.fileLoader(tools_2.viewPath + 'testLY.ejs').toString();
            if (body.charAt(0) === '#') {
                body = tools_1.hmToEjs(body);
            }
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
exports.test = test;
;
//# sourceMappingURL=test.js.map