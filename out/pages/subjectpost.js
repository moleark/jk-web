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
const tools_1 = require("../tools");
const db_1 = require("../db");
function subjectpost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let rootPath = tools_1.getRootPath(req);
        let current = req.params.current;
        let currentId = Number(current);
        let postpage;
        let pageCount;
        let pageSize = 30;
        pageCount = req.query.pageCount ? parseInt(req.query.pageCount) : 0;
        postpage = yield db_1.Dbs.content.subjectPost(currentId, pageCount * pageSize, pageSize);
        let subject = yield db_1.Dbs.content.subjectByid(currentId);
        let nextpage = pageCount + 1;
        let prepage = pageCount - 1;
        let data = tools_1.buildData(req, {
            nextpage: rootPath + 'morepost/?pageCount=' + nextpage,
            prepage: rootPath + 'morepost/?pageCount=' + prepage,
            path: rootPath + 'post/',
            post: postpage,
            pageCount: pageCount,
            subject: subject
        });
        res.render('subjectpost.ejs', data, (err, html) => {
            if (tools_1.ejsError(err, res) === true)
                return;
            res.end(html);
        });
    });
}
exports.subjectpost = subjectpost;
;
//# sourceMappingURL=subjectpost.js.map