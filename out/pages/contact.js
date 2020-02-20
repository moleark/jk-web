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
const fs = require("fs");
const ejs = require("ejs");
const tools_1 = require("../tools");
const tools_2 = require("../tools");
function contact(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let cbDataPackage = getPackageJson();
            function getPackageJson() {
                console.log('----------------------1.开始读取package.json');
                let _packageJson = fs.readFileSync('./package.json');
                console.log('----------------------读取package.json文件完毕');
                return JSON.parse(_packageJson.toString());
            }
            let data = tools_1.buildData(req, cbDataPackage);
            let header = ejs.fileLoader(tools_2.viewPath + 'headers/header' + tools_2.ejsSuffix).toString();
            let jk = ejs.fileLoader(tools_2.viewPath + '/headers/jk' + tools_2.ejsSuffix).toString();
            let hmInclude = ejs.fileLoader(tools_2.viewPath + '/headers/hm' + tools_2.ejsSuffix).toString();
            let homeHeader = ejs.fileLoader(tools_2.viewPath + 'headers/home-header' + tools_2.ejsSuffix).toString();
            let postHeader = ejs.fileLoader(tools_2.viewPath + 'headers/post' + tools_2.ejsSuffix).toString();
            // let postFooter = ejs.fileLoader(viewPath + 'footers/post' + ejsSuffix).toString();
            // let homeFooter = ejs.fileLoader(viewPath + 'footers/home-footer' + ejsSuffix).toString();
            let body = ejs.fileLoader(tools_2.viewPath + 'contact.ejs').toString();
            let html = ejs.render(header
                + jk
                + hmInclude
                + homeHeader
                + postHeader
                + body, data);
            res.end(html);
        }
        catch (err) {
            console.error(err);
            res.end('error in parsing: ' + err.message);
        }
    });
}
exports.contact = contact;
;
//# sourceMappingURL=contact.js.map