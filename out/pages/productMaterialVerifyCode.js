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
exports.captcha = void 0;
function captcha(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        /*  let { productId, languageId } = req.body;
         productId = Number(productId);
         languageId = Number(languageId);
         let detailContent: string = "";
         let jk = ejs.fileLoader(viewPath + '/headers/jk' + ejsSuffix).toString();
         let hmInclude = ejs.fileLoader(viewPath + '/headers/hm' + ejsSuffix).toString();
     
         const pointProductDetail = await Dbs.product.getProductPdfFile(productId, languageId);
     
         if (pointProductDetail.length > 0) {
             let content = pointProductDetail[0].content;
             content = hmToEjs(content);
             detailContent = jk + hmInclude + content;
             let datas = buildData(req, {});
             detailContent = ejs.render(detailContent, datas);
             res.send(detailContent);
         } else {
             res.status(404).end();
         }
      */
        let captchapng = require("captchapng");
        let mynum = Math.ceil(Math.random() * 9000 + 1000);
        req.session.captcha = mynum;
        let p = new captchapng(80, 30, mynum); // width,height,numeric captcha
        p.color(0, 0, 0, 0); // First color: background (red, green, blue, alpha)
        p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)
        let img = p.getBase64();
        let imgbase64 = Buffer.from(img, 'base64');
        res.writeHead(200, {
            'Content-Type': 'image/png'
        });
        res.end(imgbase64);
    });
}
exports.captcha = captcha;
;
//# sourceMappingURL=productMaterialVerifyCode.js.map