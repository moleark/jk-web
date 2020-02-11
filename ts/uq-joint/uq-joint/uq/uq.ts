import { Headers } from "node-fetch";
import { Fetch } from "../tool/fetch";
import { centerApi } from "../tool/centerApi";
import { host } from "../tool/host";
import { TuidMain, Tuid } from "./tuid";
import { Field, ArrFields } from "./field";
import { Joint } from "../joint";
import { OpenApi } from "../tool/openApi";

const $unitx = '$$$/$unitx';

export class Uqs {
    private joint: Joint;
    private uqs: { [name: string]: Uq } = {};
    private unit: number;
    private unitx: UqUnitx;
    constructor(joint: Joint, unit: number) {
        this.joint = joint;
        this.unit = unit;
    }

    async getOpenApi(uq:string):Promise<OpenApi> {
        return await this.joint.getOpenApi(uq);
    }

    async getUq(uqFullName: string) {
        let uq = this.uqs[uqFullName];
        if (uq !== undefined) return uq;
        return this.uqs[uqFullName] = await this.createUq(uqFullName);
    }

    private async createUq(uqFullName: string): Promise<Uq> {
        let uq = new Uq(this, uqFullName, this.unit);
        await uq.initBuild();
        this.uqs[uqFullName] = uq;
        return uq;
    }

    async init() {
        this.unitx = new UqUnitx(this, $unitx, this.unit);
        await this.unitx.initBuild();
    }

    async readBus(face: string, queue: number): Promise<any> {
        return await this.unitx.readBus(face, queue);
    }

    async writeBus(face: string, source: string, newQueue: string | number, body: any) {
        await this.unitx.writeBus(face, source, newQueue, body);
    }
}

export class Uq {
    private uqs: Uqs;
    private uqFullName: string;
    private unit: number;
    private tuids: { [name: string]: TuidMain } = {};
    private tuidArr: TuidMain[] = [];

    openApi: OpenApi;
    id: number;

    constructor(uqs: Uqs, uqFullName: string, unit: number) {
        this.uqs = uqs;
        this.uqFullName = uqFullName;
        this.unit = unit;
    }

    async buildData(data: any, props: { [name: string]: UqProp }) {
        if (data === undefined) return;
        let ret: any = {};
        let names: string[] = [];
        let promises: Promise<any>[] = [];
        for (let i in data) {
            let v = data[i];
            if (v === undefined) continue;
            let prop = props[i];
            if (prop === undefined) {
                ret[i] = v;
                continue;
            }
            let { uq: uqFullName, tuid: tuidName, tuidOwnerProp } = prop;
            let tuid: Tuid = await this.getTuidFromUq(uqFullName, tuidName);
            if (tuid === undefined) continue;
            names.push(i);
            let ownerId = tuidOwnerProp && data[tuidOwnerProp];
            promises.push(this.buildTuidValue(tuid, prop, v, ownerId));
        }
        let len = names.length;
        if (len > 0) {
            let values = await Promise.all(promises);
            for (let i = 0; i < len; i++) {
                ret[names[i]] = values[i];
            }
        }
        return ret;
    }

    private async buildTuidValue(tuid: Tuid, prop: Prop, id: number, ownerId: number): Promise<any> {
        let tuidFrom: Tuid = await tuid.getTuidFrom();
        let all: boolean;
        let props: { [name: string]: Prop | boolean };
        if (prop === undefined) {
            all = false;
        }
        else {
            all = prop.all;
            props = prop.props;
        }
        let ret = await tuidFrom.loadValue(id, ownerId, all);
        if (props === undefined) return ret;

        let names: string[] = [];
        let promises: Promise<any>[] = [];
        for (let f of tuidFrom.fields) {
            let { _tuid, _ownerField } = f;
            if (_tuid === undefined) continue;
            let { name } = f;
            //if (name === 'address') debugger;
            let prp = props[name];
            if (prp === undefined) continue;
            let v = ret[name];
            if (v === undefined) continue;
            let vType = typeof v;
            if (vType === 'object') continue;
            let p: Prop;
            if (typeof prp === 'boolean') p = undefined;
            else p = prp as Prop;
            names.push(name);
            let ownerId = _ownerField && ret[_ownerField.name];
            promises.push(this.buildTuidValue(_tuid, p, v, ownerId));
        }
        let len = names.length;
        if (len > 0) {
            let values = await Promise.all(promises);
            for (let i = 0; i < len; i++) {
                ret[names[i]] = values[i];
            }
        }
        return ret;
    }

    async getFromUq(uqFullName: string): Promise<Uq> {
        let uq = await this.uqs.getUq(uqFullName);
        return uq;
    }

    async getTuidFromUq(uqFullName: string, tuidName: string): Promise<Tuid> {
        tuidName = tuidName.toLowerCase();
        if (uqFullName === undefined) return this.getTuidFromName(tuidName);
        let uq = await this.uqs.getUq(uqFullName);
        if (uq === undefined) return;
        let tuid = uq.getTuidFromName(tuidName);
        if (tuid.from !== undefined) {
            let { owner, uq: uqName } = tuid.from;
            let fromUq = await this.uqs.getUq(owner + '/' + uqName);
            if (fromUq === undefined) return;
            tuid = fromUq.getTuidFromName(tuidName);
        }
        return tuid;
    }

    getTuidFromName(tuidName: string) {
        let parts = tuidName.split('.');
        return this.getTuid(parts[0], parts[1]);
    }

    async saveTuid(tuid: string, body: any): Promise<{ id: number, inId: number }> {
        return await this.openApi.saveTuid(tuid, body);
    }

    async saveTuidArr(tuid: string, tuidArr: string, ownerId: number, body: any): Promise<{ id: number, inId: number }> {
        return await this.openApi.saveTuidArr(tuid, tuidArr, ownerId, body);
    }

    async getTuidVId(ownerEntity: string): Promise<number> {
        return await this.openApi.getTuidVId(ownerEntity);
    }

    async setMap(map: string, body: any) {
        await this.openApi.setMap(map, body);
    }

    async delMap(map: string, body: any) {
        await this.openApi.delMap(map, body);
    }

    async initBuild() {
        await this.initOpenApi();
        await this.loadEntities();
    }

    private async initOpenApi(): Promise<void> {
        /*
        let uqUrl = await centerApi.urlFromUq(this.unit, this.uqFullName);
        if (uqUrl === undefined) return;
        let { url, urlDebug } = uqUrl;
        url = await host.getUrlOrDebug(url, urlDebug);
        */
        this.openApi = await this.uqs.getOpenApi(this.uqFullName); //new OpenApi(url, this.unit);
    }

    private buildTuids(tuids: any) {
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

    private buildAccess(access: any) {
        for (let a in access) {
            let v = access[a];
            switch (typeof v) {
                case 'string': this.fromType(a, v); break;
                case 'object': this.fromObj(a, v); break;
            }
        }
    }

    private fromType(name: string, type: string) {
        let parts = type.split('|');
        type = parts[0];
        let id = Number(parts[1]);
        switch (type) {
            case 'uq': this.id = id; break;
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

    private fromObj(name: string, obj: any) {
        switch (obj['$']) {
            //case 'sheet': this.buildSheet(name, obj); break;
        }
    }

    private async loadEntities() {
        let entities = await this.openApi.loadEntities();
        this.buildEntities(entities);
    }

    private buildEntities(entities: any) {
        let { access, tuids } = entities;
        this.buildTuids(tuids);
        this.buildAccess(access);
    }

    getTuid(name: string, div?: string, tuidUrl?: string): Tuid {
        let tuid = this.tuids[name];
        if (tuid === undefined) return;
        if (div === undefined) return tuid;
        return tuid.divs[div];
    }

    private newTuid(name: string, entityId: number): TuidMain {
        let tuid = this.tuids[name];
        if (tuid !== undefined) return tuid;
        tuid = this.tuids[name] = new TuidMain(this, name, entityId);
        this.tuidArr.push(tuid);
        return tuid;
    }
    buildFieldTuid(fields: Field[], mainFields?: Field[]) {
        if (fields === undefined) return;
        for (let f of fields) {
            let { tuid, arr, url } = f;
            if (tuid === undefined) continue;
            f._tuid = this.getTuid(tuid, arr, url);
        }
        for (let f of fields) {
            let { owner } = f;
            if (owner === undefined) continue;
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
            if (f._tuid === undefined) throw 'owner field ${owner} is not tuid';
        }
    }
    buildArrFieldsTuid(arrFields: ArrFields[], mainFields: Field[]) {
        if (arrFields === undefined) return;
        for (let af of arrFields) {
            let { fields } = af;
            if (fields === undefined) continue;
            this.buildFieldTuid(fields, mainFields);
        }
    }
}

class UqUnitx extends Uq {
    async readBus(face: string, queue: number): Promise<any> {
        return await this.openApi.readBus(face, queue);
    }

    async writeBus(face: string, source: string, newQueue: string | number, body: any) {
        await this.openApi.writeBus(face, source, newQueue, body);
    }
}

export interface Prop {
    all?: boolean;      // 获取tuid的时候，all=true则取全部属性，all=false or undeinfed则取主要属性
    props?: { [name: string]: Prop | boolean }
}

export interface UqProp extends Prop {
    uq?: string;
    tuid: string;
    tuidOwnerProp?: string;
}

interface BusMessage {
    id: number;
    face: string;
    from: string;
    body: string;
}
