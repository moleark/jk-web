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
const tuid_1 = require("./tuid");
const $unitx = '$$$/$unitx';
class Uqs {
    constructor(joint, unit) {
        this.uqs = {};
        this.joint = joint;
        this.unit = unit;
    }
    getOpenApi(uq) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.joint.getOpenApi(uq);
        });
    }
    getUq(uqFullName) {
        return __awaiter(this, void 0, void 0, function* () {
            let uq = this.uqs[uqFullName];
            if (uq !== undefined)
                return uq;
            return this.uqs[uqFullName] = yield this.createUq(uqFullName);
        });
    }
    createUq(uqFullName) {
        return __awaiter(this, void 0, void 0, function* () {
            let uq = new Uq(this, uqFullName, this.unit);
            yield uq.initBuild();
            this.uqs[uqFullName] = uq;
            return uq;
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.unitx = new UqUnitx(this, $unitx, this.unit);
            yield this.unitx.initBuild();
        });
    }
    readBus(face, queue) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.unitx.readBus(face, queue);
        });
    }
    writeBus(face, source, newQueue, body) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.unitx.writeBus(face, source, newQueue, body);
        });
    }
}
exports.Uqs = Uqs;
class Uq {
    constructor(uqs, uqFullName, unit) {
        this.tuids = {};
        this.tuidArr = [];
        this.uqs = uqs;
        this.uqFullName = uqFullName;
        this.unit = unit;
    }
    buildData(data, props) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data === undefined)
                return;
            let ret = {};
            let names = [];
            let promises = [];
            for (let i in data) {
                let v = data[i];
                if (v === undefined)
                    continue;
                let prop = props[i];
                if (prop === undefined) {
                    ret[i] = v;
                    continue;
                }
                let { uq: uqFullName, tuid: tuidName, tuidOwnerProp } = prop;
                let tuid = yield this.getTuidFromUq(uqFullName, tuidName);
                if (tuid === undefined)
                    continue;
                names.push(i);
                let ownerId = tuidOwnerProp && data[tuidOwnerProp];
                promises.push(this.buildTuidValue(tuid, prop, v, ownerId));
            }
            let len = names.length;
            if (len > 0) {
                let values = yield Promise.all(promises);
                for (let i = 0; i < len; i++) {
                    ret[names[i]] = values[i];
                }
            }
            return ret;
        });
    }
    buildTuidValue(tuid, prop, id, ownerId) {
        return __awaiter(this, void 0, void 0, function* () {
            let tuidFrom = yield tuid.getTuidFrom();
            let all;
            let props;
            if (prop === undefined) {
                all = false;
            }
            else {
                all = prop.all;
                props = prop.props;
            }
            let ret = yield tuidFrom.loadValue(id, ownerId, all);
            if (props === undefined)
                return ret;
            let names = [];
            let promises = [];
            for (let f of tuidFrom.fields) {
                let { _tuid, _ownerField } = f;
                if (_tuid === undefined)
                    continue;
                let { name } = f;
                //if (name === 'address') debugger;
                let prp = props[name];
                if (prp === undefined)
                    continue;
                let v = ret[name];
                if (v === undefined)
                    continue;
                let vType = typeof v;
                if (vType === 'object')
                    continue;
                let p;
                if (typeof prp === 'boolean')
                    p = undefined;
                else
                    p = prp;
                names.push(name);
                let ownerId = _ownerField && ret[_ownerField.name];
                promises.push(this.buildTuidValue(_tuid, p, v, ownerId));
            }
            let len = names.length;
            if (len > 0) {
                let values = yield Promise.all(promises);
                for (let i = 0; i < len; i++) {
                    ret[names[i]] = values[i];
                }
            }
            return ret;
        });
    }
    getFromUq(uqFullName) {
        return __awaiter(this, void 0, void 0, function* () {
            let uq = yield this.uqs.getUq(uqFullName);
            return uq;
        });
    }
    getTuidFromUq(uqFullName, tuidName) {
        return __awaiter(this, void 0, void 0, function* () {
            tuidName = tuidName.toLowerCase();
            if (uqFullName === undefined)
                return this.getTuidFromName(tuidName);
            let uq = yield this.uqs.getUq(uqFullName);
            if (uq === undefined)
                return;
            let tuid = uq.getTuidFromName(tuidName);
            if (tuid.from !== undefined) {
                let { owner, uq: uqName } = tuid.from;
                let fromUq = yield this.uqs.getUq(owner + '/' + uqName);
                if (fromUq === undefined)
                    return;
                tuid = fromUq.getTuidFromName(tuidName);
            }
            return tuid;
        });
    }
    getTuidFromName(tuidName) {
        let parts = tuidName.split('.');
        return this.getTuid(parts[0], parts[1]);
    }
    saveTuid(tuid, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.openApi.saveTuid(tuid, body);
        });
    }
    saveTuidArr(tuid, tuidArr, ownerId, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.openApi.saveTuidArr(tuid, tuidArr, ownerId, body);
        });
    }
    getTuidVId(ownerEntity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.openApi.getTuidVId(ownerEntity);
        });
    }
    setMap(map, body) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.openApi.setMap(map, body);
        });
    }
    delMap(map, body) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.openApi.delMap(map, body);
        });
    }
    initBuild() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initOpenApi();
            yield this.loadEntities();
        });
    }
    initOpenApi() {
        return __awaiter(this, void 0, void 0, function* () {
            /*
            let uqUrl = await centerApi.urlFromUq(this.unit, this.uqFullName);
            if (uqUrl === undefined) return;
            let { url, urlDebug } = uqUrl;
            url = await host.getUrlOrDebug(url, urlDebug);
            */
            this.openApi = yield this.uqs.getOpenApi(this.uqFullName); //new OpenApi(url, this.unit);
        });
    }
    buildTuids(tuids) {
        for (let i in tuids) {
            let schema = tuids[i];
            let { name, typeId } = schema;
            let tuid = this.newTuid(i, typeId);
            tuid.sys = true;
        }
        for (let i in tuids) {
            let schema = tuids[i];
            let { name } = schema;
            let tuid = this.getTuid(i);
            //tuid.sys = true;
            tuid.setSchema(schema);
        }
    }
    buildAccess(access) {
        for (let a in access) {
            let v = access[a];
            switch (typeof v) {
                case 'string':
                    this.fromType(a, v);
                    break;
                case 'object':
                    this.fromObj(a, v);
                    break;
            }
        }
    }
    fromType(name, type) {
        let parts = type.split('|');
        type = parts[0];
        let id = Number(parts[1]);
        switch (type) {
            case 'uq':
                this.id = id;
                break;
            case 'tuid':
                let tuid = this.newTuid(name, id);
                tuid.sys = false;
                break;
            /*
            case 'action': this.newAction(name, id); break;
            case 'query': this.newQuery(name, id); break;
            case 'book': this.newBook(name, id); break;
            case 'map': this.newMap(name, id); break;
            case 'history': this.newHistory(name, id); break;
            case 'sheet':this.newSheet(name, id); break;
            case 'pending': this.newPending(name, id); break;
            */
        }
    }
    fromObj(name, obj) {
        switch (obj['$']) {
            //case 'sheet': this.buildSheet(name, obj); break;
        }
    }
    loadEntities() {
        return __awaiter(this, void 0, void 0, function* () {
            let entities = yield this.openApi.loadEntities();
            this.buildEntities(entities);
        });
    }
    buildEntities(entities) {
        let { access, tuids } = entities;
        this.buildTuids(tuids);
        this.buildAccess(access);
    }
    getTuid(name, div, tuidUrl) {
        let tuid = this.tuids[name];
        if (tuid === undefined)
            return;
        if (div === undefined)
            return tuid;
        return tuid.divs[div];
    }
    newTuid(name, entityId) {
        let tuid = this.tuids[name];
        if (tuid !== undefined)
            return tuid;
        tuid = this.tuids[name] = new tuid_1.TuidMain(this, name, entityId);
        this.tuidArr.push(tuid);
        return tuid;
    }
    buildFieldTuid(fields, mainFields) {
        if (fields === undefined)
            return;
        for (let f of fields) {
            let { tuid, arr, url } = f;
            if (tuid === undefined)
                continue;
            f._tuid = this.getTuid(tuid, arr, url);
        }
        for (let f of fields) {
            let { owner } = f;
            if (owner === undefined)
                continue;
            let ownerField = fields.find(v => v.name === owner);
            if (ownerField === undefined) {
                if (mainFields !== undefined) {
                    ownerField = mainFields.find(v => v.name === owner);
                }
                if (ownerField === undefined) {
                    throw `owner field ${owner} is undefined`;
                }
            }
            f._ownerField = ownerField;
            let { arr, url } = f;
            f._tuid = this.getTuid(ownerField._tuid.name, arr, url);
            if (f._tuid === undefined)
                throw 'owner field ${owner} is not tuid';
        }
    }
    buildArrFieldsTuid(arrFields, mainFields) {
        if (arrFields === undefined)
            return;
        for (let af of arrFields) {
            let { fields } = af;
            if (fields === undefined)
                continue;
            this.buildFieldTuid(fields, mainFields);
        }
    }
}
exports.Uq = Uq;
class UqUnitx extends Uq {
    readBus(face, queue) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.openApi.readBus(face, queue);
        });
    }
    writeBus(face, source, newQueue, body) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.openApi.writeBus(face, source, newQueue, body);
        });
    }
}
//# sourceMappingURL=uq.js.map