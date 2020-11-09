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
exports.productMsdsFileByOrigin = exports.productMsdsVersions = exports.productMsdsFile = void 0;
const db_1 = require("../../db");
const getFilePath_1 = require("./getFilePath");
function productMsdsFile(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let { productid, lang, captcha } = req.params;
        let productId = Number(productid);
        let langId = lang === 'undefined' ? undefined : Number(lang);
        let sessionCaptcha = req.session.captcha;
        let isCorrectCaptcha = String(captcha) === String(sessionCaptcha) ? true : false;
        if (isCorrectCaptcha) {
            const productPdfFile = yield db_1.Dbs.productMSCU.getProductMsds(productId, langId);
            if (productPdfFile && productPdfFile.filename) {
                let filePath = getFilePath_1.getFilePath('msds', productPdfFile.filename, langId);
                yield res.sendFile(filePath);
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
exports.productMsdsFile = productMsdsFile;
;
/**
 *
 * @param req
 * @param res
 * @param next
 */
function productMsdsVersions(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let { origin } = req.params;
        let versions = yield db_1.Dbs.productMSCU.getProductMsdsVersions(origin);
        if (versions && versions.length > 0) {
            let result = versions.map((v) => { return { language: getFilePath_1.o[v.language], origin: v.origin }; });
            res.json(result);
        }
        else
            res.status(404).end();
    });
}
exports.productMsdsVersions = productMsdsVersions;
;
/**
 * 根据编号获取指定产品及语言的Msds文件
 * @param req
 * @param res
 * @param next
 */
function productMsdsFileByOrigin(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let { origin, lang, captcha } = req.params;
        let sessionCaptcha = req.session.captcha;
        let isCorrectCaptcha = String(captcha) === String(sessionCaptcha) ? true : false;
        if (isCorrectCaptcha) {
            let versions = yield db_1.Dbs.productMSCU.getProductMsdsVersions(origin);
            if (versions) {
                let productMsdsFile = versions.find((v) => getFilePath_1.o[v.language] === lang);
                if (productMsdsFile && productMsdsFile.filename) {
                    let filePath = getFilePath_1.getFilePath('msds', productMsdsFile.filename, productMsdsFile.language);
                    yield res.sendFile(filePath);
                }
                else
                    res.status(404).end();
            }
            else
                res.status(404).end();
        }
        else
            res.status(400).end();
    });
}
exports.productMsdsFileByOrigin = productMsdsFileByOrigin;
;
//# sourceMappingURL=productMsds.js.map