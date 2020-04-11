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
const db_1 = require("./db");
class DbContent extends db_1.Db {
    constructor() {
        super('content');
        let db = this.databaseName;
        this.sqlHomePostList = `
            SELECT a.id, a.caption, a.discription as disp, c.path as image,
                cp.update as date, d.hits, d.sumHits
            FROM ${db}.tv_postpublish cp 
                join ${db}.tv_post a on cp.post=a.id
                -- ${db}.tv_post a 
                left join ${db}.tv_template b on a.template=b.id 
                left join ${db}.tv_image c on a.image=c.id
                left join ${db}.tv_hot d on a.id=d.post
            WHERE cp.openweb = 1
            ORDER BY a.id desc
            LIMIT 10;
        `;
        this.sqlPostFromId = `
            SELECT a.content, a.caption
                FROM ${db}.tv_post a
                WHERE a.id= ? ;
        `;
        this.sqlMorePostPage = `
            SELECT a.id, a.caption, a.discription as disp, c.path as image,
                    cp.update as date, d.hits, d.sumHits
            FROM ${db}.tv_postpublish cp 
                join ${db}.tv_post a on cp.post=a.id
                -- ${db}.tv_post a 
                left join ${db}.tv_template b on a.template=b.id 
                left join ${db}.tv_image c on a.image=c.id
                left join ${db}.tv_hot d on a.id=d.post
            WHERE cp.openweb = 1
            ORDER BY a.id desc
            LIMIT ?,?;
        `;
        this.sqlAllPosts = `
            SELECT a.id, a.caption, a.discription as disp, c.path as image,
                a.$update as date, d.hits, d.sumHits
            FROM -- ${db}.tv_customerpost cp join ${db}.tv_post a on cp.post=a.id
                ${db}.tv_post a 
                left join ${db}.tv_template b on a.template=b.id 
                left join ${db}.tv_image c on a.image=c.id
                left join ${db}.tv_hot d on a.id=d.post
            ORDER BY a.id desc;
            -- LIMIT 10;
        `;
        this.sqlCategoryPostExplain = `
            SELECT a.post, a.productcategory
            FROM    ${db}.tv_postproductcatalogexplain a 
                    join ${db}.tv_postpublish cp on a.post = cp.post
            WHERE  a.productcategory=? and cp.openweb = 1;
        `;
        this.sqlCategoryPost = `
            SELECT p.id, p.caption, p.discription as disp, c.path as image,
                    p.$update as date, d.hits, d.sumHits
            FROM    ${db}.tv_postproductcatalog a 
                    join ${db}.tv_post p on a.post = p.id   
                    join ${db}.tv_postpublish cp on p.id = cp.post
                    left join ${db}.tv_image c on p.image=c.id
                    left join ${db}.tv_hot d on p.id=d.post
            WHERE  a.productcategory=? and cp.openweb = 1; 
        `;
        this.sqlSubjectById = `
            SELECT a.id, a.name, a.parent  
            FROM    ${db}.tv_subject a 
            WHERE  a.id=?; 
        `;
        this.sqlSubjectPost = `
            SELECT c.id, c.caption, c.discription as disp, d.path as image,
                    b.update as date, e.hits, e.sumHits
            FROM    ${db}.tv_postsubject a 
                    join ${db}.tv_postpublish b on a.post = b.post        
                    join ${db}.tv_post c on c.id = a.post
                    left join ${db}.tv_image d on c.image=d.id
                    left join ${db}.tv_hot e on a.post=e.post
            WHERE  a.subject = ? and b.openweb = 1
            ORDER BY b.update desc
            LIMIT ?,?;
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
    morePostPage(pageStart, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.tableFromSql(this.sqlMorePostPage, [pageStart, pageSize]);
            return ret;
        });
    }
    allPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.tableFromSql(this.sqlAllPosts);
            return ret;
        });
    }
    categoryPost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.tableFromSql(this.sqlCategoryPost, [id]);
            return ret;
        });
    }
    categoryPostExplain(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.tableFromSql(this.sqlCategoryPostExplain, [id]);
            return ret;
        });
    }
    subjectByid(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.tableFromSql(this.sqlSubjectById, [id]);
            if (ret && ret.length > 0)
                return ret[0];
            return { name: "" };
        });
    }
    subjectPost(id, pageStart, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.tableFromSql(this.sqlSubjectPost, [id, pageStart, pageSize]);
            return ret;
        });
    }
}
exports.DbContent = DbContent;
//# sourceMappingURL=dbContent.js.map