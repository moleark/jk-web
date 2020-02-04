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
const sql_1 = require("../sql");
const data_1 = require("../data");
const tools_1 = require("../tools");
let lastTime = new Date();
let cacheHtml;
//测试
function home(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (false && cacheHtml !== undefined) {
            if (Date.now() - lastTime.getTime() < 3600 * 1000) {
                res.end(cacheHtml);
                return;
            }
            ;
        }
        const ret = yield db_1.tableFromSql(sql_1.sql.homePostList);
        //let content = ejs.fileLoader('./ejs/a.ejs').toString();
        let data = {
            title: undefined,
            path: 'post/',
            news: ret,
            categories: data_1.categories,
            productNews: data_1.productNews,
            newsletter: data_1.newsletter,
            latestProducts: data_1.latestProducts,
        };
        res.render('home.ejs', data, (err, html) => {
            if (tools_1.ejsError(err, res) === true)
                return;
            res.end(cacheHtml = html);
        });
    });
}
exports.home = home;
;
/*
news: [
    {
        caption: '学霸装备，开学Let\'s购',
        disp: '好玩的，好看的，流行的，包你喜欢',
        date: new Date(),
        by: '王写手',
    },
    {
        caption: '好多人都开始用免液体试验管了',
        disp: '免液体试验管，不怕破，不怕裂，经打，经摔！',
        date: new Date(),
        by: '张主编',
    },
    {
        caption: '编说法不容易，编稿费优先',
        disp: '当互联网写手可是不容易，不是我的长项',
        date: new Date(),
        by: 'Henry',
    },
    {
        caption: '贴图标题更诱人，可是我不会',
        disp: '有闲空的时候，可以排版加图片。这会儿实在忙，就凑合了',
        date: new Date(),
        by: 'Henry',
    },
    {
        caption: '震撼发布，最新产品----灭菌效果99.9999%',
        disp: '来一个好玩的段子。点击进来看看，来看看。什么内容也没有！',
        date: new Date(),
        by: '瞎编的，哈哈',
    }
],
*/
//# sourceMappingURL=home.js.map