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
exports.privacy = void 0;
const ejs = require("ejs");
const config = require("config");
const db_1 = require("../db");
const tools_1 = require("../tools");
function privacy(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let privacyId = config.get("privacyId");
        try {
            let template, content;
            let discounts = [];
            let correlation = [];
            let id = req.params.id;
            //获取内容
            const ret = yield db_1.Dbs.content.postFromId(privacyId);
            if (ret.length === 0) {
                template = `post id=${id} is not defined`;
            }
            else {
                //获取模板
                let header = ejs.fileLoader(tools_1.viewPath + 'headers/header' + tools_1.ejsSuffix).toString();
                let homeHeader = ejs.fileLoader(tools_1.viewPath + 'headers/home-header' + tools_1.ejsSuffix).toString();
                let homeFooter = ejs.fileLoader(tools_1.viewPath + 'footers/home-footer' + tools_1.ejsSuffix).toString();
                //获取内容明细
                content = ret[0].content;
                if (content.charAt(0) === '#') {
                    content = tools_1.hmToEjs(content);
                }
                //获取优惠活动
                template = header
                    + homeHeader
                    + content
                    + homeFooter;
            }
            //获取贴点贴文
            let cacheHotPosts;
            let lastHotTick = 0;
            let now = Date.now();
            if (cacheHotPosts === undefined || now - lastHotTick > 60 * 1000) {
                lastHotTick = now;
                cacheHotPosts = yield db_1.Dbs.content.getHotPost();
            }
            //获取栏目
            let subject;
            subject = yield db_1.Dbs.content.getAllSubjects();
            let data = yield tools_1.buildData(req, {
                subject: subject,
                discounts: discounts,
                correlation: correlation,
                hotPosts: cacheHotPosts,
                content: content,
                titleshow: false
            });
            let html = ejs.render(template, data);
            res.end(html);
            tools_1.ipHit(req, id);
        }
        catch (e) {
            tools_1.ejsError(e, res);
        }
    });
}
exports.privacy = privacy;
;
//# sourceMappingURL=privacy.js.map