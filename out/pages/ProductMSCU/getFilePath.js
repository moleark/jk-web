"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilePath = exports.o = void 0;
const config = require("config");
exports.o = process.env.NODE_ENV === 'production'
    ? {
        196: "CN",
        38: "EN",
        35: "DE",
        56: "EN-US",
    }
    : {
        197: "CN",
        52: "EN",
        32: "DE",
        55: "EN-US",
    };
function getFilePath(type, fileName, lang) {
    let fileAscr = exports.o[lang] ? exports.o[lang] : (fileName.includes('_EN') ? 'EN' : 'CN');
    let MSCUPath = config.get("MSCUPath");
    if (process.env.NODE_ENV === 'production')
        return `${MSCUPath}${type}/${fileAscr}/${fileName}`;
    else
        return MSCUPath + fileName; //'100008_CN.PDF' 
}
exports.getFilePath = getFilePath;
//# sourceMappingURL=getFilePath.js.map