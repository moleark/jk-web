"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilePath = void 0;
const config = require("config");
/**
 *
 * @param type 文件类型 msds | spec
 * @param fileName 文件名称
 * @param lang 语言版本
 */
function getFilePath(type, fileName, lang) {
    let o = config.get('FILELANGVER');
    let fileAscr = o[lang] ? o[lang] : (fileName.includes('_EN') ? 'EN' : 'CN');
    let MSCUPath = config.get("MSCUPath");
    if (type === 'spec')
        return `${MSCUPath}/${fileName}`;
    return `${MSCUPath}${type}/${fileAscr}/${fileName}`;
}
exports.getFilePath = getFilePath;
//# sourceMappingURL=getFilePath.js.map