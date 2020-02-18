import { Request, Response } from "express";
import * as ejs from 'ejs';
import { ejsError, getRootPath, buildData, hm, hmToEjs } from "../tools";
import { device } from "../tools";
import { viewPath, ejsSuffix } from "../tools";

export async function test(req: Request, res:Response) {
    try {
		hm(`
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

		let data = buildData(req, undefined);

		let header = ejs.fileLoader(viewPath + 'headers/header' + ejsSuffix).toString();
		let jk = ejs.fileLoader(viewPath + '/headers/jk' + ejsSuffix).toString();
		let hmInclude = ejs.fileLoader(viewPath + '/headers/hm' + ejsSuffix).toString();
		let homeHeader = ejs.fileLoader(viewPath + 'headers/home-header' + ejsSuffix).toString();
		let postHeader = ejs.fileLoader(viewPath + 'headers/post' + ejsSuffix).toString();

		let postFooter = ejs.fileLoader(viewPath + 'footers/post' + ejsSuffix).toString();
        let homeFooter = ejs.fileLoader(viewPath + 'footers/home-footer' + ejsSuffix).toString();
		let body = ejs.fileLoader(viewPath + 'testhm.ejs').toString();
		if (body.charAt(0) === '#') {
			body = hmToEjs(body);
		}

		let html = ejs.render(
			header
			 + jk
			 + hmInclude
            + homeHeader
			+ postHeader
            + body 
            + postFooter
            + homeFooter
            , data);
        res.end(html);
    }
    catch (err) {
        console.error(err);
        res.end('error in parsing: ' + err.message);
    }
};
