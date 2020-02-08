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
        let htmlText = yield ejs.renderFile('./public/views/test.ejs', data);
        res.end(htmlText);
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