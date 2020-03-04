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
const db_1 = require("../db");
let lastTick = 0;
let lastHotCalcTick = Date.now() / 1000;
const hits = [];
const saveGap = 30; // 正式上线，应该是10*60，十分钟
function ipHit(req, post) {
    return __awaiter(this, void 0, void 0, function* () {
        let ip = getNetIp(req);
        let now = Math.floor(Date.now() / 1000);
        let hit = now + '\t' + ip + '\t' + post;
        hits.push(hit);
        if (now - lastTick > saveGap || hits.length > 1000) {
            let data = '\n' + hits.join('\n') + '\n\n';
            db_1.Dbs.content.execProc('tv_hit', [db_1.Dbs.unit, 0, data]);
            hits.splice(0);
        }
        lastTick = now;
        console.log(`ip:${ip} now:${now} lastHostCalcTick:${lastHotCalcTick} post:${post} hits:${hits.length}`);
        if (now - lastHotCalcTick > 60) {
            console.log('Dbs.content.execProc(tv_calchot, [Dbs.unit, 0, ]);');
            db_1.Dbs.content.execProc('tv_calchot', [db_1.Dbs.unit, 0, '\n']);
            lastHotCalcTick = now;
        }
    });
}
exports.ipHit = ipHit;
function getNetIp(_http) {
    var ipStr = _http.headers['X-Real-IP'] || _http.headers['x-forwarded-for'];
    if (ipStr) {
        var ipArray = ipStr.split(",");
        if (ipArray.length > 1) {
            //如果获取到的为ip数组
            for (var i = 0; i < ipArray.length; i++) {
                var ipNumArray = ipArray[i].split(".");
                var tmp = ipNumArray[0] + "." + ipNumArray[1];
                if (tmp == "192.168" ||
                    (ipNumArray[0] == "172" && Number(ipNumArray[1]) >= 16 && Number(ipNumArray[1]) <= 32) || tmp == "10.7") {
                    continue;
                }
                return ipArray[i];
            }
        }
        return ipArray[0];
    }
    else {
        //获取不到时
        return _http.ip.substring(_http.ip.lastIndexOf(":") + 1);
    }
}
exports.getNetIp = getNetIp;
;
//# sourceMappingURL=ipHit.js.map