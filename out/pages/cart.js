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
exports.cart = void 0;
const ejs = require("ejs");
const tools_1 = require("../tools");
function cart(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let header = ejs.fileLoader(tools_1.viewPath + 'headers/header' + tools_1.ejsSuffix).toString();
        let homeHeader = ejs.fileLoader(tools_1.viewPath + 'headers/home-header' + tools_1.ejsSuffix).toString();
        let homeFooter = ejs.fileLoader(tools_1.viewPath + 'footers/home-footer' + tools_1.ejsSuffix).toString();
        let body = ejs.fileLoader(tools_1.viewPath + 'cart.ejs').toString();
        let template = header + homeHeader
            + '<div class="container my-3">'
            + body
            + '</div>'
            + homeFooter;
        let data = yield tools_1.buildData(req, {});
        let html = ejs.render(template, data);
        res.end(html);
    });
}
exports.cart = cart;
//# sourceMappingURL=cart.js.map