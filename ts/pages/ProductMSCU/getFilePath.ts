import * as config from 'config';

export function getFilePath(type: string, fileName: string, lang?: number | string) {
    let o = config.get('FILELANGVER');
    let fileAscr = o[lang] ? o[lang] : (fileName.includes('_EN') ? 'EN' : 'CN');
    let MSCUPath = config.get("MSCUPath");
    return `${MSCUPath}${type}/${fileAscr}/${fileName}`;
    /* if (process.env.NODE_ENV === 'production')
        return `${MSCUPath}${type}/${fileAscr}/${fileName}`;
    else
        return MSCUPath + fileName;//'100008_CN.PDF' */
}