"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const home_1 = require("./home");
const post_1 = require("./post");
const category_1 = require("./category");
const test_1 = require("./test");
exports.homeRouter = express_1.Router({ mergeParams: true });
exports.homeRouter.get('/', home_1.home);
exports.homeRouter.get('/post/:id', post_1.post);
exports.homeRouter.get('/category/:current', category_1.category);
exports.homeRouter.get('/test', test_1.test);
//# sourceMappingURL=index.js.map