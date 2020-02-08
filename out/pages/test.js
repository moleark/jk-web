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
function test(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = {
            title: undefined,
        };
        let header = ejs.fileLoader('./public/views/headers/home-header.ejs').toString();
        let footer = ejs.fileLoader('./public/views/footers/home-footer.ejs').toString();
        let body = ejs.fileLoader('./public/views/test.ejs').toString();
        let html = ejs.render(header + body + footer, { title: undefined });
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