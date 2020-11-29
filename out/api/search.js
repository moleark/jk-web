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
exports.search = void 0;
const productService_1 = require("../services/product/productService");
function search(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let { params } = req;
        let { key, pageNumber: pn } = params;
        let pageNumber = 1;
        if (pn)
            pageNumber = parseInt(pn);
        pageNumber = pageNumber < 1 ? 1 : pageNumber;
        let result = yield productService_1.productService.search(key, pageNumber);
        return res.json(result);
    });
}
exports.search = search;
//# sourceMappingURL=search.js.map