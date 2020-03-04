import { Request } from "express";
import { Dbs } from "../db";

let lastTick: number = 0;
let lastHotCalcTick: number = Date.now() / 1000;
const hits:string[] = [];
const saveGap = 30; // 正式上线，应该是10*60，十分钟

export async function ipHit(req: Request, post:number|string) {
    let ip = getNetIp(req);
    let now = Math.floor(Date.now() / 1000);

    let hit = now + '\t' + ip + '\t' + post;
    hits.push(hit);
    if (now - lastTick > saveGap || hits.length > 1000) {
        let data = '\n' + hits.join('\n') + '\n\n';
        Dbs.content.execProc('tv_hit', [Dbs.unit, 0, data]);
        hits.splice(0);
    }
    lastTick = now;

	console.log(`ip:${ip} now:${now} lastHostCalcTick:${lastHotCalcTick} post:${post} hits:${hits.length}`);
    if (now - lastHotCalcTick > 60) {
		console.log('Dbs.content.execProc(tv_calchot, [Dbs.unit, 0, ]);');
        Dbs.content.execProc('tv_calchot', [Dbs.unit, 0, '\n']);
        lastHotCalcTick = now;
    }
}

export function getNetIp(_http: Request) {
    var ipStr = _http.headers['X-Real-IP'] || _http.headers['x-forwarded-for'];
    if (ipStr) {
        var ipArray = (ipStr as string).split(",");
        if (ipArray.length > 1) {
            //如果获取到的为ip数组
            for (var i = 0; i < ipArray.length; i++) {
                var ipNumArray = ipArray[i].split(".");
                var tmp = ipNumArray[0] + "." + ipNumArray[1];
                if (tmp == "192.168" || 
                    (ipNumArray[0] == "172" && Number(ipNumArray[1]) >= 16 && Number(ipNumArray[1]) <= 32) || tmp == "10.7")
                {
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
};
