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
exports.categoryInstruction = void 0;
const tools_1 = require("../tools");
const db_1 = require("../db");
const ejs = require("ejs");
function categoryInstruction(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let current = req.params.current;
        let currentId = Number(current);
        let explain = "", postID;
        let jk = ejs.fileLoader(tools_1.viewPath + '/headers/jk' + tools_1.ejsSuffix).toString();
        let hmInclude = ejs.fileLoader(tools_1.viewPath + '/headers/hm' + tools_1.ejsSuffix).toString();
        let postHeader = ejs.fileLoader(tools_1.viewPath + 'headers/post' + tools_1.ejsSuffix).toString();
        let postFooter = ejs.fileLoader(tools_1.viewPath + 'footers/post' + tools_1.ejsSuffix).toString();
        const explainlist = yield db_1.Dbs.content.categoryPostExplain(currentId);
        if (explainlist.length > 0) {
            postID = explainlist[0].post;
            const ret = yield db_1.Dbs.content.postFromId(postID);
            if (ret.length > 0) {
                let content = ret[0].content;
                content = tools_1.hmToEjs(content);
                explain = jk + hmInclude + postHeader + content + postFooter;
                let datas = tools_1.buildData(req, {});
                explain = ejs.render(explain, datas);
                res.send(explain);
            }
        }
        else {
            res.status(404).end();
        }
    });
}
exports.categoryInstruction = categoryInstruction;
;
//# sourceMappingURL=categoryinstruction.js.map