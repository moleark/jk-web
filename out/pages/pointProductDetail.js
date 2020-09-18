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
exports.pointProductDetail = void 0;
const tools_1 = require("../tools");
const db_1 = require("../db");
const ejs = require("ejs");
function pointProductDetail(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let current = req.params.current;
        let currentId = Number(current);
        let detailContent = "";
        let jk = ejs.fileLoader(tools_1.viewPath + '/headers/jk' + tools_1.ejsSuffix).toString();
        let hmInclude = ejs.fileLoader(tools_1.viewPath + '/headers/hm' + tools_1.ejsSuffix).toString();
        let postHeader = ejs.fileLoader(tools_1.viewPath + 'headers/post' + tools_1.ejsSuffix).toString();
        let postFooter = ejs.fileLoader(tools_1.viewPath + 'footers/post' + tools_1.ejsSuffix).toString();
        const pointProductDetail = yield db_1.Dbs.pointshop.categoryPostExplain(currentId);
        if (pointProductDetail.length > 0) {
            let content = pointProductDetail[0].content;
            content = tools_1.hmToEjs(content);
            detailContent = jk + hmInclude + postHeader + content + postFooter;
            let datas = tools_1.buildData(req, {});
            detailContent = ejs.render(detailContent, datas);
            res.send(detailContent);
        }
        else {
            res.status(404).end();
        }
    });
}
exports.pointProductDetail = pointProductDetail;
;
//# sourceMappingURL=pointProductDetail.js.map