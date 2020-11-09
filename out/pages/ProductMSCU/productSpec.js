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
exports.productSpecFile = void 0;
const db_1 = require("../../db");
const getFilePath_1 = require("./getFilePath");
function productSpecFile(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let { productid, captcha } = req.params;
        let productId = Number(productid);
        let sessionCaptcha = req.session.captcha;
        let isCorrectCaptcha = String(captcha) === String(sessionCaptcha) ? true : false;
        if (isCorrectCaptcha) {
            const productPdfFile = yield db_1.Dbs.productMSCU.getProductSpec(productId);
            if (productPdfFile && productPdfFile.filename) {
                let filePath = getFilePath_1.getFilePath('spec', productPdfFile.filename);
                yield res.sendFile(filePath);
            }
            else
                res.status(404).end();
        }
        else
            res.status(412).end();
    });
}
exports.productSpecFile = productSpecFile;
;
//# sourceMappingURL=productSpec.js.map