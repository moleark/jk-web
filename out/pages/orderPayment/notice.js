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
exports.aliNotice = exports.wxNotice = void 0;
const wxPay_1 = require("./wxPay");
function wxNotice(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let { a } = req.params;
        let resJson = wxPay_1.xmlToJson('');
        let { return_code } = resJson;
        if (return_code === 'SUCCESS') {
            res.send(resJson);
        }
        res.send({ return_code });
    });
}
exports.wxNotice = wxNotice;
;
function aliNotice(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.end();
    });
}
exports.aliNotice = aliNotice;
;
//# sourceMappingURL=notice.js.map