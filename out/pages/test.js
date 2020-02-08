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
        let data = {
            title: undefined,
        };
        let m = tools_1.isWechat(req) ? '-m' : '';
        let header = ejs.fileLoader(tools_2.viewPath + 'headers/home-header' + m + tools_2.ejsSuffix).toString();
        let footer = ejs.fileLoader(tools_2.viewPath + 'footers/home-footer' + m + tools_2.ejsSuffix).toString();
        let body = ejs.fileLoader(tools_2.viewPath + 'test.ejs').toString();
        let html = ejs.render(header
            + '<div class="container my-3">'
            + body
            + '</div>'
            + footer, data);
        res.end(html);
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