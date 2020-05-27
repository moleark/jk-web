"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.device = void 0;
function device(req) {
    let userAgent = req.headers['user-agent'];
    if (userAgent.toLowerCase().indexOf('micromessenger') >= 0)
        return 'wechat';
}
exports.device = device;
//# sourceMappingURL=userAgent.js.map