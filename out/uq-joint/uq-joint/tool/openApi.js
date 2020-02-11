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
const fetch_1 = require("./fetch");
/**
 * 这个OpenApi好像是没有用
 */
class OpenApi extends fetch_1.Fetch {
    constructor(baseUrl, unit) {
        super(baseUrl);
        this.unit = unit;
    }
    appendHeaders(headers) {
        headers.append('unit', String(this.unit));
    }
    bus(faces, faceUnitMessages) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.post('open/bus', {
                faces: faces,
                faceUnitMessages: faceUnitMessages,
            });
            return ret;
        });
    }
    readBus(face, queue) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.post('open/joint-read-bus', {
                unit: this.unit,
                face: face,
                queue: queue
            });
            return ret;
        });
    }
    writeBus(face, from, queue, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.post('open/joint-write-bus', {
                unit: this.unit,
                face: face,
                from: from,
                sourceId: queue,
                body: body,
            });
            return ret;
        });
    }
    tuid(unit, id, tuid, maps) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.post('open/tuid', {
                unit: unit,
                id: id,
                tuid: tuid,
                maps: maps,
            });
            return ret;
        });
    }
    saveTuid(tuid, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.post('joint/tuid/' + tuid, data);
            return ret;
        });
    }
    saveTuidArr(tuid, arr, owner, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.post(`joint/tuid-arr/${tuid}/${owner}/${arr}`, data);
            return ret;
        });
    }
    getTuidVId(tuid) {
        return __awaiter(this, void 0, void 0, function* () {
            let parts = tuid.split('_');
            let url;
            if (parts.length === 1)
                url = `joint/tuid-vid/${tuid}`;
            else
                url = `joint/tuid-arr-vid/${parts[0]}/${parts[1]}`;
            let ret = yield this.get(url);
            return ret;
        });
    }
    scanSheet(sheet, scanStartId) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.get('joint/sheet-scan/' + sheet + '/' + scanStartId);
            return ret;
        });
    }
    action(action, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.post('joint/action-json/' + action, data);
        });
    }
    setMap(map, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.post('joint/action-json/' + map + '$add$', data);
        });
    }
    delMap(map, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.post('joint/action-json/' + map + '$del$', data);
        });
    }
    /*
    }
    
    export class OpenApi extends Fetch {
    */
    /*
        protected unit: number;
        constructor(baseUrl: string, unit: number) {
            super(baseUrl);
            this.unit = unit;
        }
    */
    /*
        protected appendHeaders(headers: Headers) {
            headers.append('unit', String(this.unit));
        }
    
        async fresh(unit: number, stamps: any): Promise<any> {
            let ret = await this.post('open/fresh', {
                unit: unit,
                stamps: stamps
            });
            return ret;
        }
        async bus(faces: string, faceUnitMessages: string) {
            let ret = await this.post('open/bus', {
                faces: faces,
                faceUnitMessages: faceUnitMessages,
            });
            return ret;
        }
        async readBus(face: string, queue: number): Promise<BusMessage> {
            let ret = await this.post('open/joint-read-bus', {
                unit: this.unit,
                face: face,
                queue: queue
            });
            return ret;
        }
        async writeBus(face: string, from: string, queue: string | number, body: string): Promise<BusMessage> {
            let ret = await this.post('open/joint-write-bus', {
                unit: this.unit,
                face: face,
                from: from,
                sourceId: queue,
                body: body,
            });
            return ret;
        }
    */
    /*
        async tuid(id: number, tuid: string, maps: string[]): Promise<any> {
            let ret = await this.post('open/tuid', {
                unit: this.unit,
                id: id,
                tuid: tuid,
                maps: maps,
            });
            return ret;
        }
        async saveTuid(tuid: string, data: any): Promise<any> {
            let ret = await this.post('joint/tuid/' + tuid, data);
            return ret;
        }
        async saveTuidArr(tuid: string, arr: string, owner: number, data: any): Promise<any> {
            try {
                let ret = await this.post(`joint/tuid-arr/${tuid}/${owner}/${arr}`, data);
                return ret;
            } catch (error) {
                console.error(error);
                if (error.code === 'ETIMEDOUT')
                    await this.saveTuidArr(tuid, arr, owner, data);
                else
                    throw error;
            }
        }
        async getTuidVId(tuid: string): Promise<number> {
            let parts = tuid.split('.');
            let url: string;
            if (parts.length === 1)
                url = `joint/tuid-vid/${tuid}`;
            else
                url = `joint/tuid-arr-vid/${parts[0]}/${parts[1]}`;
            let ret = await this.get(url);
            return ret;
        }
    */
    loadTuidMainValue(tuidName, id, allProps) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.post(`open/tuid-main/${tuidName}`, { unit: this.unit, id: id, all: allProps });
            return ret;
        });
    }
    loadTuidDivValue(tuidName, divName, id, ownerId, allProps) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.post(`open/tuid-div/${tuidName}/${divName}`, { unit: this.unit, id: id, ownerId: ownerId, all: allProps });
            return ret;
        });
    }
    /*
        async scanSheet(sheet: string, scanStartId: number): Promise<any> {
            let ret = await this.get('joint/sheet-scan/' + sheet + '/' + scanStartId);
            return ret;
        }
        async action(action: string, data: any): Promise<void> {
            await this.post('joint/action-json/' + action, data);
        }
        async setMap(map: string, data: any): Promise<void> {
            await this.post('joint/action-json/' + map + '$add$', data);
        }
        async delMap(map: string, data: any): Promise<void> {
            await this.post('joint/action-json/' + map + '$del$', data);
        }
    */
    loadEntities() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('open/entities/' + this.unit);
        });
    }
    schema(entityName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('open/entity/' + entityName);
        });
    }
}
exports.OpenApi = OpenApi;
/*
const uqOpenApis: { [uqFullName: string]: { [unit: number]: OpenApi } } = {};
export async function getOpenApi(uqFullName: string, unit: number): Promise<OpenApi> {
    let openApis = uqOpenApis[uqFullName];
    if (openApis === null) return null;
    if (openApis === undefined) {
        uqOpenApis[uqFullName] = openApis = {};
    }
    let uqUrl = await centerApi.urlFromUq(unit, uqFullName);
    if (uqUrl === undefined) return openApis[unit] = null;
    let { url, urlDebug } = uqUrl;
    url = await host.getUrlOrDebug(url, urlDebug);
    return openApis[unit] = new OpenApi(url, unit);
}
*/ 
//# sourceMappingURL=openApi.js.map