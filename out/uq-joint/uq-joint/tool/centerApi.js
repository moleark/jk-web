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
//import config from 'config';
const fetch_1 = require("./fetch");
/*
const centerHost = config.get<string>('centerhost');
const centerUrl = urlSetCenterHost(config.get<string>('center'));

export function urlSetCenterHost(url:string):string {
    return url.replace('://centerhost/', '://'+centerHost+'/');
}
*/
class CenterApi extends fetch_1.Fetch {
    busSchema(owner, bus) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.get('open/bus', { owner: owner, bus: bus });
            return ret.schema;
        });
    }
    serviceBus(serviceUID, serviceBuses) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.post('open/save-service-bus', {
                service: serviceUID,
                bus: serviceBuses,
            });
        });
    }
    unitx(unit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('open/unitx', { unit: unit });
        });
    }
    uqUrl(unit, uq) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('open/uq-url', { unit: unit, uq: uq });
        });
    }
    urlFromUq(unit, uqFullName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('open/url-from-uq', { unit: unit, uq: uqFullName });
        });
    }
    uqDb(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('open/uqdb', { name: name });
        });
    }
    pushTo(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('push', msg);
        });
    }
    unitxBuses(unit, busOwner, bus, face) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('open/unitx-buses', { unit: unit, busOwner: busOwner, bus: bus, face: face });
        });
    }
    /**
     * 顺序取到所有最近的user信息，包括密码
     * @param start：这个是userid的起始数；
     * @param page: 这个是每次返回的数组的长度；
     * 返回值是一个数组，数组中对象的schema如下面的注释所示
     */
    queueOut(start, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('open/queue-out', { start: start, page: page });
        });
    }
    /*
    param:
    {
        $type: '$user',
        id: 2,
        name: '1',
        pwd: 'pwd',
        nick: 'nick1-1',
        icon: 'icon1-1',
        country: 3,
        mobile: 13901060561,
        email: 'liaohengyi123@outlook.com',
        wechat: 'wechat212',
    }
    */
    /**
     * 用来将user数据写入Tonva系统
     * @param param: 要写入的user数据，格式如上
     */
    queueIn(param) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('open/queue-in', param);
        });
    }
}
exports.centerApi = new CenterApi();
//# sourceMappingURL=centerApi.js.map