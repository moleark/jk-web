"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const home_1 = require("./home");
const wayne_ligsh_test_1 = require("./wayne-ligsh-test");
const post_1 = require("./post");
exports.homeRouter = express_1.Router({ mergeParams: true });
exports.homeRouter.get('/', home_1.home);
exports.homeRouter.get('/post/:id', post_1.post);
exports.homeRouter.get('/wayne-ligsh-test', wayne_ligsh_test_1.wayneLigshTest);
//# sourceMappingURL=index.js.map