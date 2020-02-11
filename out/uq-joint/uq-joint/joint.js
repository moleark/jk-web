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
const tool_1 = require("./db/mysql/tool");
const mapData_1 = require("./tool/mapData");
const map_1 = require("./tool/map");
const router_1 = require("./router");
const database_1 = require("./db/mysql/database");
const createMapTable_1 = require("./tool/createMapTable");
const faceSchemas_1 = require("./tool/faceSchemas");
const uq_1 = require("./uq/uq");
const centerApi_1 = require("./tool/centerApi");
const openApi_1 = require("./tool/openApi");
const host_1 = require("./tool/host");
const interval = 3 * 1000;
class Joint {
    constructor(settings) {
        this.tick = () => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('tick ' + new Date().toLocaleString());
                //await this.scanPull();
                yield this.scanIn();
                // await this.scanOut();
                // bus还没有弄好，暂时屏蔽
                // await this.scanBus();
            }
            catch (err) {
                console.error('error in timer tick');
                console.error(err);
            }
            finally {
                setTimeout(this.tick, interval);
            }
        });
        this.uqOpenApis = {};
        this.settings = settings;
        let { unit, uqIns: uqIns } = settings;
        this.unit = unit;
        if (uqIns === undefined)
            return;
        this.uqs = new uq_1.Uqs(this, unit);
        for (let uqIn of uqIns) {
            let { entity, type } = uqIn;
            if (this.uqInDict[entity] !== undefined)
                throw 'can not have multiple ' + entity;
            this.uqInDict[entity] = uqIn;
        }
    }
    createRouter() {
        return router_1.createRouter(this.settings);
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield host_1.host.start(this.prodOrTest === 'test');
            centerApi_1.centerApi.initBaseUrl(host_1.host.centerUrl);
            yield this.uqs.init();
            setTimeout(this.tick, interval);
        });
    }
    //async getOpenApi(uqFullName:string, unit:number):Promise<OpenApi> {
    getOpenApi(uq) {
        return __awaiter(this, void 0, void 0, function* () {
            let openApis = this.uqOpenApis[uq];
            if (openApis === null)
                return null;
            if (openApis === undefined) {
                this.uqOpenApis[uq] = openApis = {};
            }
            let uqUrl = yield centerApi_1.centerApi.urlFromUq(this.unit, uq);
            if (uqUrl === undefined)
                return openApis[this.unit] = null;
            //let {url, urlDebug} = uqUrl;
            //url = await host.getUrlOrDebug(url, urlDebug);
            /*
            if (urlDebug !== undefined) {
                try {
                    urlDebug = urlSetUqHost(urlDebug);
                    urlDebug = urlSetUnitxHost(urlDebug);
                    let ret = await fetch(urlDebug + 'hello');
                    if (ret.status !== 200) throw 'not ok';
                    let text = await ret.text();
                    url = urlDebug;
                }
                catch (err) {
                }
            }
            */
            let { db, url, urlTest } = uqUrl;
            let realUrl = host_1.host.getUrlOrTest(db, url, urlTest);
            return openApis[this.unit] = new openApi_1.OpenApi(realUrl, this.unit);
        });
    }
    /*
    private async scanPull() {
        for (let i in this.settings.pull) {
            console.log('scan pull ', i);
            let pull = this.settings.pull[i];
            for (;;) {
                let retp = await tableFromProc('read_queue_in_p', [i]);
                let queue:number;
                if (!retp || retp.length === 0) {
                    queue = 0;
                }
                else {
                    queue = retp[0].queue;
                }
                let newQueue = await pull(this, queue);
                if (newQueue === undefined) break;
                await execProc('write_queue_in_p', [i, newQueue]);
            }
        }
    }
    */
    /**
     *
     */
    scanIn() {
        return __awaiter(this, void 0, void 0, function* () {
            let { uqIns, pullReadFromSql } = this.settings;
            if (uqIns === undefined)
                return; //
            for (let uqIn of uqIns) {
                let { uq, entity, pull, pullWrite } = uqIn;
                let queueName = uq + ':' + entity;
                console.log('scan in ' + queueName + ' at ' + new Date().toLocaleString());
                let promises = [];
                for (;;) {
                    let message;
                    let queue;
                    let ret = undefined;
                    if (pull !== undefined) {
                        let retp = yield tool_1.tableFromProc('read_queue_in_p', [queueName]);
                        if (retp.length > 0) {
                            queue = retp[0].queue;
                        }
                        else {
                            queue = '0';
                        }
                        switch (typeof pull) {
                            case 'function':
                                ret = yield pull(this, uqIn, queue);
                                break;
                            case 'string':
                                if (pullReadFromSql === undefined) {
                                    let err = 'pullReadFromSql should be defined in settings!';
                                    console.error(err);
                                    throw err;
                                }
                                ret = yield pullReadFromSql(pull, queue);
                                break;
                        }
                        if (ret === undefined)
                            break;
                        /*
                        queue = ret.queue;
                        message = ret.data;
                        */
                    }
                    else {
                        let retp = yield tool_1.tableFromProc('read_queue_in', [queueName]);
                        if (!retp || retp.length === 0)
                            break;
                        let { id, body, date } = retp[0];
                        ret = { lastPointer: id, data: [JSON.parse(body)] };
                        /*
                        queue = id;
                        message = JSON.parse(body);
                        */
                    }
                    let { lastPointer, data } = ret;
                    data.forEach(message => {
                        if (pullWrite !== undefined) {
                            promises.push(pullWrite(this, message));
                        }
                        else {
                            promises.push(this.uqIn(uqIn, message));
                        }
                    });
                    try {
                        // console.log(`process in ${queue}: `, message);
                        yield Promise.all(promises);
                        promises.splice(0);
                        yield tool_1.execProc('write_queue_in_p', [queueName, lastPointer]);
                    }
                    catch (error) {
                        console.error(error);
                        break;
                    }
                }
            }
        });
    }
    uqIn(uqIn, data) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (uqIn.type) {
                case 'tuid':
                    yield this.uqInTuid(uqIn, data);
                    break;
                case 'tuid-arr':
                    yield this.uqInTuidArr(uqIn, data);
                    break;
                case 'map':
                    yield this.uqInMap(uqIn, data);
                    break;
            }
        });
    }
    uqInTuid(uqIn, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let { key, mapper, uq: uqFullName, entity: tuid } = uqIn;
            if (key === undefined)
                throw 'key is not defined';
            if (uqFullName === undefined)
                throw 'tuid ' + tuid + ' not defined';
            let keyVal = data[key];
            let mapToUq = new mapData_1.MapToUq(this);
            let body = yield mapToUq.map(data, mapper);
            let uq = yield this.uqs.getUq(uqFullName);
            try {
                let ret = yield uq.saveTuid(tuid, body);
                let { id, inId } = ret;
                if (id < 0)
                    id = -id;
                yield map_1.map(tuid, id, keyVal);
                return id;
            }
            catch (error) {
                console.error(uqFullName + ':' + tuid);
                console.error(body);
                console.error(error);
                if (error.code === "ETIMEDOUT") {
                    yield this.uqInTuid(uqIn, data);
                }
                else {
                    throw error;
                }
            }
        });
    }
    uqInTuidArr(uqIn, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let { key, owner, mapper, uq: uqFullName, entity } = uqIn;
            if (key === undefined)
                throw 'key is not defined';
            if (uqFullName === undefined)
                throw 'uq ' + uqFullName + ' not defined';
            if (entity === undefined)
                throw 'tuid ' + entity + ' not defined';
            let parts = entity.split('_');
            let tuid = parts[0];
            if (parts.length === 1)
                throw 'tuid ' + entity + ' must has .arr';
            let tuidArr = parts[1];
            let keyVal = data[key];
            if (owner === undefined)
                throw 'owner is not defined';
            let ownerVal = data[owner];
            try {
                let mapToUq = new mapData_1.MapToUq(this);
                let ownerId = yield this.mapOwner(uqIn, tuid, ownerVal);
                if (ownerId === undefined)
                    throw 'owner value is undefined';
                let body = yield mapToUq.map(data, mapper);
                let uq = yield this.uqs.getUq(uqFullName);
                let ret = yield uq.saveTuidArr(tuid, tuidArr, ownerId, body);
                let { id, inId } = ret;
                if (id === undefined)
                    id = inId;
                else if (id < 0)
                    id = -id;
                yield map_1.map(entity, id, keyVal);
                return id;
            }
            catch (error) {
                console.error(uqFullName + ':' + tuid + '-' + tuidArr);
                console.error(error);
                if (error.code === "ETIMEDOUT") {
                    yield this.uqInTuidArr(uqIn, data);
                }
                else {
                    throw error;
                }
            }
        });
    }
    mapOwner(uqIn, ownerEntity, ownerVal) {
        return __awaiter(this, void 0, void 0, function* () {
            let { uq: uqFullName } = uqIn;
            let sql = `select id from \`${database_1.databaseName}\`.\`map_${ownerEntity}\` where no='${ownerVal}'`;
            let ret;
            try {
                ret = yield tool_1.execSql(sql);
            }
            catch (err) {
                yield createMapTable_1.createMapTable(ownerEntity);
                ret = yield tool_1.execSql(sql);
            }
            if (ret.length === 0) {
                try {
                    let uq = yield this.uqs.getUq(uqFullName);
                    let vId = yield uq.getTuidVId(ownerEntity);
                    yield map_1.map(ownerEntity, vId, ownerVal);
                    return vId;
                }
                catch (error) {
                    console.error(error);
                    if (error.code === "ETIMEDOUT") {
                        this.mapOwner(uqIn, ownerEntity, ownerVal);
                    }
                    else {
                        throw error;
                    }
                }
            }
            return ret[0]['id'];
        });
    }
    uqInMap(uqIn, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let { mapper, uq: uqFullName, entity } = uqIn;
            let mapToUq = new mapData_1.MapToUq(this);
            let body = yield mapToUq.map(data, mapper);
            try {
                let uq = yield this.uqs.getUq(uqFullName);
                let { $ } = data;
                if ($ === '-')
                    yield uq.delMap(entity, body);
                else
                    yield uq.setMap(entity, body);
            }
            catch (error) {
                console.error(error);
                if (error.code === "ETIMEDOUT") {
                    yield this.uqInMap(uqIn, data);
                }
                else {
                    throw error;
                }
            }
        });
    }
    /**
     *
     */
    scanOut() {
        return __awaiter(this, void 0, void 0, function* () {
            let { uqOuts } = this.settings;
            if (uqOuts === undefined)
                return;
            for (let uqOut of uqOuts) {
                let { uq, entity } = uqOut;
                let queueName = uq + ':' + entity;
                console.log('scan out ' + queueName);
                for (;;) {
                    let queue;
                    let retp = yield tool_1.tableFromProc('read_queue_out_p', [queueName]);
                    if (retp.length === 0)
                        queue = 0;
                    else
                        queue = retp[0].queue;
                    let ret;
                    ret = yield this.uqOut(uqOut, queue);
                    if (ret === undefined)
                        break;
                    let { queue: newQueue, data } = ret;
                    yield tool_1.execProc('write_queue_out_p', [queueName, newQueue]);
                }
            }
        });
    }
    uqOut(uqOut, queue) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret;
            let { type } = uqOut;
            switch (type) {
                //case 'bus': ret = await this.uqOutBus(uqOut as UqOutBus, queue); break;
            }
            return ret;
        });
    }
    /**
     *
     */
    scanBus() {
        return __awaiter(this, void 0, void 0, function* () {
            let { name: joinName, bus } = this.settings;
            if (bus === undefined)
                return;
            let monikerPrefix = '$bus/';
            for (let uqBus of bus) {
                let { face, mapper, push, pull, uqIdProps } = uqBus;
                // bus out(从bus中读取消息，发送到外部系统)
                let moniker = monikerPrefix + face;
                for (;;) {
                    if (push === undefined)
                        break;
                    let queue;
                    let retp = yield tool_1.tableFromProc('read_queue_out_p', [moniker]);
                    if (retp.length > 0) {
                        queue = retp[0].queue;
                    }
                    else {
                        queue = 430000000000000;
                    }
                    let message = yield this.uqs.readBus(face, queue);
                    if (message === undefined)
                        break;
                    let { id: newQueue, from, body } = message;
                    let json = yield faceSchemas_1.faceSchemas.unpackBusData(face, body);
                    if (uqIdProps !== undefined && from !== undefined) {
                        let uq = yield this.uqs.getUq(from);
                        if (uq !== undefined) {
                            try {
                                let newJson = yield uq.buildData(json, uqIdProps);
                                json = newJson;
                            }
                            catch (error) {
                                console.error(error);
                                break;
                            }
                        }
                    }
                    let mapFromUq = new mapData_1.MapFromUq(this);
                    let outBody = yield mapFromUq.map(json, mapper);
                    if ((yield push(this, uqBus, queue, outBody)) === false)
                        break;
                    yield tool_1.execProc('write_queue_out_p', [moniker, newQueue]);
                }
                // bus in(从外部系统读入数据，写入bus)
                for (;;) {
                    if (pull === undefined)
                        break;
                    let queue;
                    let retp = yield tool_1.tableFromProc('read_queue_in_p', [moniker]);
                    if (retp.length > 0) {
                        queue = retp[0].queue;
                    }
                    else {
                        queue = 0;
                    }
                    let message = yield pull(this, uqBus, queue);
                    if (message === undefined)
                        break;
                    let { lastPointer: newQueue, data } = message;
                    //let newQueue = await this.busIn(queue);
                    //if (newQueue === undefined) break;
                    let mapToUq = new mapData_1.MapToUq(this);
                    let inBody = yield mapToUq.map(data[0], mapper);
                    let packed = yield faceSchemas_1.faceSchemas.packBusData(face, inBody);
                    yield this.uqs.writeBus(face, joinName, newQueue, packed);
                    yield tool_1.execProc('write_queue_in_p', [moniker, newQueue]);
                }
            }
        });
    }
    userIn(uqIn, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let { key, mapper, uq: uqFullName, entity: tuid } = uqIn;
            if (key === undefined)
                throw 'key is not defined';
            if (uqFullName === undefined)
                throw 'tuid ' + tuid + ' not defined';
            let keyVal = data[key];
            let mapToUq = new mapData_1.MapToUq(this);
            try {
                let body = yield mapToUq.map(data, mapper);
                let ret = yield centerApi_1.centerApi.queueIn(body);
                if (ret === undefined || typeof ret !== 'number')
                    throw new Error('user in 返回值不正确。');
                if (ret > 0)
                    yield map_1.map(tuid, ret, keyVal);
                return ret;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
}
exports.Joint = Joint;
class ProdJoint extends Joint {
    get prodOrTest() { return 'prod'; }
}
exports.ProdJoint = ProdJoint;
class TestJoint extends Joint {
    get prodOrTest() { return 'test'; }
}
exports.TestJoint = TestJoint;
//# sourceMappingURL=joint.js.map