"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isWechat(req) {
    let userAgent = req.headers['user-agent'];
    return userAgent.toLowerCase().indexOf('micromessenger') >= 0;
}
exports.isWechat = isWechat;
//# sourceMappingURL=userAgent.js.map