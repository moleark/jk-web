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
const tools_1 = require("../tools");
const tools_2 = require("../tools");
function test(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            tools_1.hm(`
#grid a cell
a	b	c
d	e	f
e	f	g


#ul	a
l1
	l1-1
	l1-2
		l1-2-1
		l1-2-2
	l1-3
		l1-3-1
		l1-3-2
l2
	l2-1
	l2-2
l33---33
	dd
	b

#p
ddsdf	sdfsdf	
asfas
afas fsaf saf

#t0	a
文章主标题标题

#t0	b
文章绿标题

#t0	c
文章红标题

#t1	a
主标题标题

#t1	b
小绿标题

#t1	c
小红标题

#t2	a
主标题标题

#t2	b
小绿标题

#t2	c
小红标题

#t3	a
主标题标题

#t3	b
小绿标题');

#t3	c
', '小红标题');

#p	a
', 内容);

#
<i class="fa fa-plus"></i>
<div class="text-danger">注意了，这是这是直接写的代码</div>

#-	a

#p	b
', 内容);

#p	c
', 内容);
`);
            let data = tools_1.buildData(req, undefined);
            let header = ejs.fileLoader(tools_2.viewPath + 'headers/header' + tools_2.ejsSuffix).toString();
            let jk = ejs.fileLoader(tools_2.viewPath + '/headers/jk' + tools_2.ejsSuffix).toString();
            let hmInclude = ejs.fileLoader(tools_2.viewPath + '/headers/hm' + tools_2.ejsSuffix).toString();
            let homeHeader = ejs.fileLoader(tools_2.viewPath + 'headers/home-header' + tools_2.ejsSuffix).toString();
            let homeFooter = ejs.fileLoader(tools_2.viewPath + 'footers/home-footer' + tools_2.ejsSuffix).toString();
            let body = ejs.fileLoader(tools_2.viewPath + 'testhm.ejs').toString();
            if (body.charAt(0) === '#') {
                body = tools_1.hmToEjs(body);
            }
            let html = ejs.render(header
                + jk
                + hmInclude
                + homeHeader
                + '<div class="container my-3">'
                + body
                + '</div>'
                + homeFooter, data);
            res.end(html);
        }
        catch (err) {
            console.error(err);
            res.end('error in parsing: ' + err.message);
        }
    });
}
exports.test = test;
;
//# sourceMappingURL=test.js.map