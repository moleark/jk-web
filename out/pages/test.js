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
const tools_3 = require("../tools");
function test(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let data = {
                root: tools_1.getRootPath(req),
                title: undefined,
            };
            let m = tools_2.isWechat(req) ? '-m' : '';
            let header = ejs.fileLoader(tools_3.viewPath + 'headers/header' + m + tools_3.ejsSuffix).toString();
            let homeHeader = ejs.fileLoader(tools_3.viewPath + 'headers/home-header' + m + tools_3.ejsSuffix).toString();
            let homeFooter = ejs.fileLoader(tools_3.viewPath + 'footers/home-footer' + m + tools_3.ejsSuffix).toString();
            let body = ejs.fileLoader(tools_3.viewPath + 'test1.ejs').toString();
            let html = ejs.render(header
                + homeHeader
                + '<div class="container my-3">'
                + body
                + '</div>'
                + homeFooter, data);
            res.end(html);
        }
        catch (err) {
            console.error(err);
            res.end('error in parsing: ' + err.message);
        }
        /*
        res.render(htmlText, data, (err, html) => {
            if (ejsError(err, res) === true) return;
            res.end(html);
        });
        */
    });
}
exports.test = test;
;
//# sourceMappingURL=test.js.map