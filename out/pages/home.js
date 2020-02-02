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
const db_1 = require("../db");
let lastTime = new Date();
let cacheHtml;
const db = 'webbuilder$test';
const sqlForWeb = `
SELECT a.id, a.caption, a.discription as disp, c.path as image, a.$update as date
    FROM ${db}.tv_post a 
        left join ${db}.tv_template b on a.template=b.id 
        left join ${db}.tv_image c on a.image=c.id
    ORDER BY a.id desc
    LIMIT 10;
`;
function home(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (false && cacheHtml !== undefined) {
            if (Date.now() - lastTime.getTime() < 3600 * 1000) {
                res.end(cacheHtml);
                return;
            }
            ;
        }
        const ret = yield db_1.tableFromSql(sqlForWeb);
        //let content = ejs.fileLoader('./ejs/a.ejs').toString();
        let data = {
            path: 'https://c.jkchemical.com/webBuilder/post/',
            news: ret,
        };
        res.render('home.ejs', data, (err, html) => {
            res.end(cacheHtml = html);
        });
        //res.end(html);
    });
}
exports.home = home;
;
//# sourceMappingURL=home.js.map