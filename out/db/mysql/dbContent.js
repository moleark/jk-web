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
const dbBase_1 = require("./dbBase");
class DbContent extends dbBase_1.DbBase {
    constructor() {
        super('content');
        let db = this.databaseName;
        this.sqlHomePostList = `
            SELECT a.id, a.caption, a.discription as disp, c.path as image,
                a.$update as date, d.hits, d.sumHits
            FROM -- ${db}.tv_customerpost cp join ${db}.tv_post a on cp.post=a.id
                ${db}.tv_post a 
                left join ${db}.tv_template b on a.template=b.id 
                left join ${db}.tv_image c on a.image=c.id
                left join ${db}.tv_hot d on a.id=d.post
            ORDER BY a.id desc
            LIMIT 10;
        `;
        this.sqlPostFromId = `
            SELECT a.content, a.caption
                FROM ${db}.tv_post a
                WHERE a.id= ? ;
        `;
    }
    homePostList() {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.tableFromSql(this.sqlHomePostList);
            return ret;
        });
    }
    postFromId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.tableFromSql(this.sqlPostFromId, [id]);
            return ret;
        });
    }
}
exports.DbContent = DbContent;
//# sourceMappingURL=dbContent.js.map