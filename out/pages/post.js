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
const ejs = require("ejs");
const db_1 = require("../db");
const sql_1 = require("../sql");
//import { ejsError } from "../tools";
function post(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let id = req.params.id;
        const ret = yield db_1.tableFromSql(sql_1.sql.postFromId, [id]);
        let template, title;
        if (ret.length === 0) {
            template = `post id=${id} is not defined`;
        }
        else {
            let header = ejs.fileLoader('./public/views/headers/home-header.ejs').toString();
            let footer = ejs.fileLoader('./public/views/footers/home-footer.ejs').toString();
            template = header
                + '<div class="container my-3">'
                + ret[0].content
                + footer;
            title = ret[0].caption;
        }
        //let content = ejs.fileLoader('./ejs/a.ejs').toString();
        let data = {
            title: title,
        };
        let html = ejs.render(template, data);
        res.end(html);
        /*
        res.render('post.ejs', data, (err, html) => {
            if (ejsError(err, res) === true) return;
            res.end(html);
        });
        */
    });
}
exports.post = post;
;
//# sourceMappingURL=post.js.map