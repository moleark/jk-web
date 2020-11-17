"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilePath = void 0;
const config = require("config");
function getFilePath(type, fileName, lang) {
    let o = config.get('FILELANGVER');
    let fileAscr = o[lang] ? o[lang] : (fileName.includes('_EN') ? 'EN' : 'CN');
    let MSCUPath = config.get("MSCUPath");
    return `${MSCUPath}${type}/${fileAscr}/${fileName}`;
    /* if (process.env.NODE_ENV === 'production')
        return `${MSCUPath}${type}/${fileAscr}/${fileName}`;
    else
        return MSCUPath + fileName;//'100008_CN.PDF' */
}
exports.getFilePath = getFilePath;
//# sourceMappingURL=getFilePath.js.map