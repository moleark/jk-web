"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cas2string = exports.isCAS = void 0;
function isCAS(cas) {
    if (!cas)
        return false;
    cas = cas.replace(/-/g, '');
    if (!/\d{5,20}/.test(cas))
        return false;
    let casArr = [...cas];
    let len = casArr.length;
    let sum = casArr.reduce((a, c, i) => {
        return a + parseInt(c) * (len - i - 1);
    }, 0);
    return sum % 10 === parseInt(casArr[len - 1]);
}
exports.isCAS = isCAS;
function cas2string(cas) {
    // the length of cas must be more then or equal 5
    let casstr = '';
    if (typeof cas === 'number' && cas > 10000) {
        casstr = cas.toString();
    }
    if (typeof cas === 'string')
        casstr = cas.replace(/-/g, '');
    let l = casstr.length;
    if (l > 4)
        return casstr.substring(0, l - 3) + '-' + casstr.substring(l - 3, l - 1) + '-' + casstr.substring(l - 1);
}
exports.cas2string = cas2string;
//# sourceMappingURL=cas.js.map