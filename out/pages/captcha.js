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
exports.captcha = exports.SessionCaptcha = void 0;
exports.SessionCaptcha = null;
function captcha(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let captchapng = require("captchapng");
        let mynum = Math.ceil(Math.random() * 9000 + 1000);
        req.session.captcha = mynum;
        exports.SessionCaptcha = req.session.captcha;
        // console.log(req.session);
        let p = new captchapng(80, 30, mynum); // width,height,numeric captcha
        p.color(0, 0, 0, 0); // First color: background (red, green, blue, alpha)
        p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)
        let img = p.getBase64();
        let imgbase64 = Buffer.from(img, 'base64');
        res.writeHead(200, {
            'Content-Type': 'image/png'
        });
        res.end(imgbase64);
    });
}
exports.captcha = captcha;
;
//# sourceMappingURL=captcha.js.map