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
exports.productPdfFile = void 0;
const db_1 = require("../db");
const captcha_1 = require("./captcha");
const config = require("config");
const o = process.env.NODE_ENV === 'production'
    ? {
        196: "CN",
        38: "EN",
        35: "DE",
        56: "EN-US",
    }
    : {
        197: "CN",
        52: "EN",
        32: "DE",
        55: "EN-US",
    };
function productPdfFile(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let { productid, lang, captcha } = req.params;
        let productId = Number(productid);
        let langId = lang === 'undefined' ? undefined : Number(lang);
        let sessionCaptcha = req.session.captcha;
        // console.log(req.session);
        let isCorrectCaptcha = String(captcha) === String(captcha_1.SessionCaptcha) ? true : false;
        // let isCorrectCaptcha = String(captcha) === String(req.session.captcha) ? true : false;
        if (isCorrectCaptcha) {
            const productPdfFile = yield db_1.Dbs.product.getProductPdfFile(productId, langId);
            if (productPdfFile && productPdfFile.filename) {
                let fileName = productPdfFile.filename;
                let fileAscr = langId !== undefined ? o[langId] : (fileName.includes('_EN') ? 'EN' : 'CN');
                let filePath = `${config.get("MSCUPath")}/${langId !== undefined ? 'msds' : 'spec'}/${fileAscr}/${fileName}`;
                if (process.env.NODE_ENV !== 'production')
                    filePath = config.get("MSCUPath") + fileName;
                yield res.sendFile(filePath); //'100008_CN.PDF'
            }
            else {
                res.status(404).end();
            }
        }
        else {
            res.status(412).end();
        }
    });
}
exports.productPdfFile = productPdfFile;
;
//# sourceMappingURL=productPdfFile.js.map