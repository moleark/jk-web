"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ejsError(err, res) {
    if (err === null)
        return false;
    let ret = '';
    let keys = Object.getOwnPropertyNames(err);
    for (let i of keys) {
        ret += i + ': ' + err[i] + '\n\n';
    }
    res.end(`<!DOCTYPE html><html><head><title>错误 - ejs</title><meta charset="UTF-8"></head>
    <body><div>错误发生了！</div><pre>`
        + ret
        + '</pre></body></html>');
    return true;
}
exports.ejsError = ejsError;
//# sourceMappingURL=ejsError.js.map