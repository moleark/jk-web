"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHINESE = exports.SALESREGION = exports.ejsSuffix = exports.viewPath = void 0;
const config = require("config");
exports.viewPath = './public/views/';
exports.ejsSuffix = '.ejs';
exports.SALESREGION = config.get('SALESREGION');
exports.CHINESE = config.get('CHINESE');
//# sourceMappingURL=consts.js.map