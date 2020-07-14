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
exports.home = void 0;
const db_1 = require("../db");
const ejs = require("ejs");
const tools_1 = require("../tools");
let lastHomeTick = Date.now();
let cacheHtml;
//测试
function home(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let rootPath = tools_1.getRootPath(req);
            tools_1.ipHit(req, -1);
            let now = Date.now();
            if (false && cacheHtml !== undefined) {
                let ht = lastHomeTick;
                lastHomeTick = now;
                if (lastHomeTick - ht < 3600 * 1000) {
                    res.end(cacheHtml);
                    return;
                }
                ;
            }
            //轮播图
            let slideshowlist = yield db_1.Dbs.content.getSlideshow();
            let random = Math.floor(Math.random() * 10 % (slideshowlist.length));
            let slideshow = slideshowlist[random];
            //资讯中心
            let information = yield db_1.Dbs.content.informationPost();
            //优惠活动
            let discounts = yield db_1.Dbs.content.subjectPost(18, 0, 30);
            //产品推荐
            let recommend = yield db_1.Dbs.content.subjectPost(17, 0, 30);
            //获取热点贴文
            let cacheHotPosts;
            let lastHotTick = 0;
            if (cacheHotPosts === undefined || now - lastHotTick > 60 * 1000) {
                lastHotTick = now;
                cacheHotPosts = yield db_1.Dbs.content.getHotPost();
            }
            //获取根目录节点
            const rootcategories = yield db_1.Dbs.product.getRootCategories();
            for (let i = 0; i < rootcategories.length; i++) {
                let category = rootcategories[i];
                let { id } = category;
                rootcategories[i].children = yield db_1.Dbs.product.getChildrenCategories(id);
            }
            let header = ejs.fileLoader(tools_1.viewPath + 'headers/header' + tools_1.ejsSuffix).toString();
            let homeHeader = ejs.fileLoader(tools_1.viewPath + 'headers/home-header' + tools_1.ejsSuffix).toString();
            let home = ejs.fileLoader(tools_1.viewPath + 'home' + tools_1.ejsSuffix).toString();
            let homeFooter = ejs.fileLoader(tools_1.viewPath + 'footers/home-footer' + tools_1.ejsSuffix).toString();
            let template = header
                + homeHeader
                + home
                + homeFooter;
            console.log(rootPath, 'rootPath');
            let data = tools_1.buildData(req, {
                path: rootPath + 'post/',
                slideshow: slideshow,
                information: information,
                hots: cacheHotPosts,
                discounts: discounts,
                recommend: recommend,
                rootcategories: rootcategories,
                titleshow: true
            });
            let html = ejs.render(template, data);
            res.end(html);
        }
        catch (e) {
            tools_1.ejsError(e, res);
        }
    });
}
exports.home = home;
;
//# sourceMappingURL=home.js.map