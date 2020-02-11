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
const entity_1 = require("./entity");
const maxCacheSize = 1000;
class Cache {
    constructor() {
        this.values = {};
        this.queue = [];
    }
    getValue(id) {
        let ret = this.values[id];
        if (ret === undefined)
            return;
        this.moveToHead(id);
        return ret;
    }
    setValue(id, value) {
        if (this.queue.length >= maxCacheSize) {
            let removeId = this.queue.shift();
            delete this.values[removeId];
        }
        if (this.values[id] !== undefined) {
            this.moveToHead(id);
        }
        else {
            this.queue.push(id);
        }
        this.values[id] = value;
    }
    moveToHead(id) {
        let index = this.queue.findIndex(v => v === id);
        this.queue.splice(index, 1);
        this.queue.push(id);
    }
}
class Tuid extends entity_1.Entity {
    constructor() {
        super(...arguments);
        this.cache = new Cache;
        this.cacheAllProps = new Cache;
    }
    get typeName() { return 'tuid'; }
    getIdFromObj(obj) { return obj.id; }
    /*
    async getApiFrom() {
        if (this.from === undefined) return this.uq.openApi;
        if (this.fromUq === undefined) {
            let {owner, uq:uqName} = this.from;
            this.fromUq = await this.uq.getFromUq(owner+'/'+uqName);
        }
        return this.fromUq.openApi;
    }
    */
    setSchema(schema) {
        super.setSchema(schema);
        this.from = schema.from;
    }
    getTuidFrom() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.from === undefined)
                return this;
            if (this.fromUq === undefined) {
                let { owner, uq: uqName } = this.from;
                this.fromUq = yield this.uq.getFromUq(owner + '/' + uqName);
            }
            return this.fromUq.getTuidFromName(this.name);
        });
    }
    loadValue(id, ownerId, allProps) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret;
            if (allProps === true) {
                ret = this.cacheAllProps.getValue(id);
            }
            else {
                ret = this.cache.getValue(id);
            }
            if (ret !== undefined)
                return ret;
            let openApi = yield this.getApiFrom();
            let tuidValue = yield this.internalLoadTuidValue(openApi, id, ownerId, allProps);
            if (tuidValue.length > 0)
                ret = tuidValue[0];
            else
                ret = undefined;
            if (allProps === true)
                this.cacheAllProps.setValue(id, ret);
            else
                this.cache.setValue(id, ret);
            return ret;
        });
    }
}
exports.Tuid = Tuid;
class TuidMain extends Tuid {
    get Main() { return this; }
    get uqApi() { return this.uq.openApi; }
    ;
    setSchema(schema) {
        super.setSchema(schema);
        let { arrs } = schema;
        if (arrs !== undefined) {
            this.divs = {};
            for (let arr of arrs) {
                let { name } = arr;
                let tuidDiv = new TuidDiv(this.uq, name, this.typeId);
                tuidDiv.owner = this;
                this.divs[name] = tuidDiv;
                tuidDiv.setSchema(arr);
            }
        }
    }
    internalLoadTuidValue(openApi, id, ownerId, allProps) {
        return __awaiter(this, void 0, void 0, function* () {
            return openApi.loadTuidMainValue(this.name, id, allProps);
        });
    }
}
exports.TuidMain = TuidMain;
class TuidDiv extends Tuid {
    get Main() { return this.owner; }
    getTuidFrom() {
        return __awaiter(this, void 0, void 0, function* () {
            let ownerFrom = yield this.owner.getTuidFrom();
            if (ownerFrom === this.owner)
                return this;
            return ownerFrom.divs[this.name];
            /*
                    if (this.fromUq === undefined) {
                        let {owner, uq:uqName} = this.from;
                        this.fromUq = await this.uq.getFromUq(owner+'/'+uqName);
                    }
                    return this.fromUq.getTuidFromName(this.name);
            */
        });
    }
    /*
    async getApiFrom() {
        return await this.owner.getApiFrom();
    }
    */
    internalLoadTuidValue(openApi, id, ownerId, allProps) {
        return __awaiter(this, void 0, void 0, function* () {
            return openApi.loadTuidDivValue(this.owner.name, this.name, id, ownerId, allProps);
        });
    }
}
exports.TuidDiv = TuidDiv;
//# sourceMappingURL=tuid.js.map