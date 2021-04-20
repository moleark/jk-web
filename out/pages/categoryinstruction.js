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
const db_1 = require("../db");
const post_1 = require("./post");
function categoryInstruction(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let current = req.params.current;
        let currentId = Number(current);
        let explain = "", postID;
        const explainlist = yield db_1.Dbs.content.getCategoryInstruction(currentId);
        if (explainlist.length > 0) {
            postID = explainlist[0].post;
            const ret = yield db_1.Dbs.content.postFromId(postID);
            if (ret.length > 0) {
                let postArticle = ret[0];
                // explain = await renderPostArticle(req, postArticle);
                explain = yield post_1.renderPostContent(req, postArticle);
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