
export function hasChineseChar(key: string) {
    return /[\u4E00-\u9FFF]+/g.test(key);
}