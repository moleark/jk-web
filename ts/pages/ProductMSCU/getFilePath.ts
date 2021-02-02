import * as config from 'config';

/**
 * 
 * @param type 文件类型 msds | spec
 * @param fileName 文件名称
 * @param lang 语言版本
 */
export function getFilePath(type: string, fileName: string, lang?: number | string) {
    let o = config.get('FILELANGVER');
    let fileAscr = o[lang] ? o[lang] : (fileName.includes('_EN') ? 'EN' : 'CN');
    let MSCUPath = config.get("MSCUPath");
    if (type === 'spec') return `${MSCUPath}/${fileName}`;
    return `${MSCUPath}${type}/${fileAscr}/${fileName}`;
}