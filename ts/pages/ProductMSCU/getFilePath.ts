import * as config from 'config';

export const o = process.env.NODE_ENV === 'production'
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
    }

export function getFilePath(type: string, fileName: string, lang?: number | string) {
    let fileAscr = o[lang] ? o[lang] : (fileName.includes('_EN') ? 'EN' : 'CN');
    let MSCUPath = config.get("MSCUPath");
    if (process.env.NODE_ENV === 'production')
        return `${MSCUPath}${type}/${fileAscr}/${fileName}`;
    else
        return MSCUPath + fileName;//'100008_CN.PDF' 
}