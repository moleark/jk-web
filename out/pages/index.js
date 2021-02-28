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
exports.homeRouter = void 0;
const express_1 = require("express");
const cors = require("cors");
const config = require("config");
const home_1 = require("./home");
const post_1 = require("./post");
const category_1 = require("./category");
const search_1 = require("./search");
const product_1 = require("./product");
const iframe_1 = require("./iframe");
const language_1 = require("./language");
const test_1 = require("./test");
const shop_1 = require("./shop");
const version_1 = require("./version");
const law_1 = require("./law");
const contact_1 = require("./contact");
const webMap_1 = require("./webMap");
const information_1 = require("./information");
const allPosts_1 = require("./allPosts");
const productCategory_1 = require("./productCategory");
const cas_1 = require("./cas");
const productName_1 = require("./productName");
const ProductResources_1 = require("./ProductResources");
const casSubclass_1 = require("./casSubclass");
const technicalSupport_1 = require("./technicalSupport");
const subjectpost_1 = require("./subjectpost");
const categoryinstruction_1 = require("./categoryinstruction");
const cart_1 = require("./cart");
const post_test_1 = require("./post_test");
const pointProductDetail_1 = require("./pointProductDetail");
const captcha_1 = require("./captcha");
const productPdfFile_1 = require("./productPdfFile");
const productMsds_1 = require("./ProductMSCU/productMsds");
const productSpec_1 = require("./ProductMSCU/productSpec");
const orderPayment_1 = require("./orderPayment/orderPayment");
const wxPay_1 = require("./orderPayment/wxPay");
const notice_1 = require("./orderPayment/notice");
const privacy_1 = require("./privacy");
const page_1 = require("./page");
const db_1 = require("../db");
exports.homeRouter = express_1.Router({ mergeParams: true });
exports.homeRouter.get('/', home_1.home);
exports.homeRouter.get('/post/:id', post_1.post);
exports.homeRouter.get('/product-catalog/:current', category_1.category);
/*
homeRouter.get('/category/:current', category);
homeRouter.get('/productcategory/:current', category);
*/
exports.homeRouter.get('/search/:key', search_1.search);
exports.homeRouter.get('/search', search_1.search);
exports.homeRouter.get('/product/:id', product_1.product);
exports.homeRouter.get('/iframe', iframe_1.iframe);
exports.homeRouter.get('/shop', shop_1.shop); //转移到nginx中实现，免去在web中维护shop的麻烦
exports.homeRouter.get('/version', version_1.version);
exports.homeRouter.get('/law', law_1.law);
exports.homeRouter.get('/contact', contact_1.contact);
exports.homeRouter.get('/information', information_1.information);
exports.homeRouter.get('/all-posts', allPosts_1.allPosts);
exports.homeRouter.get('/language', language_1.language);
exports.homeRouter.get('/webMap', webMap_1.webMap);
exports.homeRouter.get('/test/*', test_1.test);
exports.homeRouter.get('/productCategory', productCategory_1.productCategory);
exports.homeRouter.get('/cas', cas_1.cas);
exports.homeRouter.get('/productName', productName_1.productName);
exports.homeRouter.get('/ProductResources', ProductResources_1.ProductResources);
exports.homeRouter.get('/casSubclass/:current', casSubclass_1.casSubclass);
exports.homeRouter.get('/technicalSupport', technicalSupport_1.technicalSupport);
exports.homeRouter.get('/subjectpost/:current', subjectpost_1.subjectpost);
exports.homeRouter.get('/cart', cart_1.cart);
exports.homeRouter.get('/post_test/:id', post_test_1.post_test);
exports.homeRouter.get('/partial/categoryinstruction/:current', categoryinstruction_1.categoryInstruction);
exports.homeRouter.get('/partial/pointproductdetail/:current', pointProductDetail_1.pointProductDetail);
const MSCUCorsOptions = {
    origin: config.get("MSCUCorsOrigins"),
    credentials: true
};
exports.homeRouter.get('/partial/captcha', captcha_1.captcha);
exports.homeRouter.get('/partial/productMsdsVersion/:origin', productMsds_1.productMsdsVersions);
exports.homeRouter.get('/partial/productMsdsFileByOrigin/:lang/:origin/:captcha', cors(MSCUCorsOptions), productMsds_1.productMsdsFileByOrigin);
exports.homeRouter.get('/partial/productSpecFileByOrigin/:origin/:captcha', cors(MSCUCorsOptions), productSpec_1.productSpecFileByOrigin);
exports.homeRouter.get('/partial/productMsdsFile/:lang/:productid/:captcha', cors(MSCUCorsOptions), productMsds_1.productMsdsFile);
exports.homeRouter.get('/partial/productSpecFile/:productid/:captcha', cors(MSCUCorsOptions), productSpec_1.productSpecFile);
exports.homeRouter.get('/partial/orderPayment/:payid/:appid/:orderid', orderPayment_1.orderPayment);
exports.homeRouter.get('/partial/payOrderQuery/:orderid', wxPay_1.wxOrderQuery);
exports.homeRouter.get('/partial/wxpay/notice', notice_1.wxNotice);
//delete
exports.homeRouter.get('/partial/productpdffile/:captcha/:lang/:productid', cors(MSCUCorsOptions), productPdfFile_1.productPdfFile); // 保持兼容，暂时保留
exports.homeRouter.get('/privacy', privacy_1.privacy); // 保持兼容，暂时保留
exports.homeRouter.post('/addroute', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { body } = req;
    let { pagePath } = body;
    if (pagePath) {
        let ret = yield db_1.Dbs.content.getPage(pagePath);
        if (ret.length > 0)
            exports.homeRouter.get(pagePath, page_1.page);
    }
    res.status(200).end();
}));
exports.homeRouter.get('/initDynamicRoute', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let ret = yield db_1.Dbs.content.getRoute();
    ret.forEach(e => {
        exports.homeRouter.get(e.url, page_1.page);
    });
    res.status(200).end();
}));
//# sourceMappingURL=index.js.map