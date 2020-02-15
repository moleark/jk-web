"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function csv(text) {
    if (typeof csv !== 'string')
        return text;
    let ret = [];
    if (!text)
        return ret;
    let lines = text.split('\n');
    for (let line of lines) {
        let rArr = line.split('\t');
        if (rArr.length === 1) {
            let c0 = rArr[0].trim();
            if (c0.length === 0)
                continue;
            rArr[0] = c0;
        }
        ret.push(rArr);
    }
    return ret;
}
exports.csv = csv;
//# sourceMappingURL=csv.js.map