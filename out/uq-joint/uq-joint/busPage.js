"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const getIp_1 = require("./getIp");
function busPage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8'
        });
        res.write('<h4>数据交换机</h4>');
        res.write(`<pre>
sample post:
[
    {moniker: "product", queue: 0, data: undefined},
    {moniker: "product", queue: undefined, data: {"a":1, "discription":"xxx"}}
]
</pre>`);
        res.write('<br/>');
        res.write('<div>in ip ' + getIp_1.getIp(req) +
            ' out ip ' + getIp_1.getNetIp(req) +
            ' cliet ip ' + getIp_1.getClientIp(req) + '</div><br/><br/>');
        res.end();
    });
}
exports.busPage = busPage;
//# sourceMappingURL=busPage.js.map