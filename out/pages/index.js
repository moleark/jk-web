"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
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
const morepost_1 = require("./morepost");
const allPosts_1 = require("./allPosts");
const classifyy_1 = require("./classifyy");
exports.homeRouter = express_1.Router({ mergeParams: true });
exports.homeRouter.get('/', home_1.home);
exports.homeRouter.get('/post/:id', post_1.post);
exports.homeRouter.get('/category/:current', category_1.category);
exports.homeRouter.get('/search/:key', search_1.search);
exports.homeRouter.get('/search', search_1.search);
exports.homeRouter.get('/product/:id', product_1.product);
exports.homeRouter.get('/iframe', iframe_1.iframe);
exports.homeRouter.get('/shop', shop_1.shop);
exports.homeRouter.get('/version', version_1.version);
exports.homeRouter.get('/law', law_1.law);
exports.homeRouter.get('/contact', contact_1.contact);
exports.homeRouter.get('/morepost', morepost_1.morepost);
exports.homeRouter.get('/all-posts', allPosts_1.allPosts);
exports.homeRouter.get('/language', language_1.language);
exports.homeRouter.get('/webMap', webMap_1.webMap);
exports.homeRouter.get('/test/*', test_1.test);
exports.homeRouter.get('/category/:current/classifyy/:index', classifyy_1.classifyy);
//# sourceMappingURL=index.js.map