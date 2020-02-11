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
const centerApi_1 = require("./centerApi");
const tab = '\t';
const ln = '\n';
class FaceSchemas {
    constructor() {
        this.busSchemas = {};
        this.faceSchemas = {};
    }
    packBusData(faceName, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data === undefined)
                return;
            let faceSchema = yield this.getFaceSchema(faceName);
            if (faceSchema === undefined)
                return;
            return this.pack(faceSchema, data);
        });
    }
    unpackBusData(faceName, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data === undefined)
                return;
            let faceSchema = yield this.getFaceSchema(faceName);
            if (faceSchema === undefined)
                return;
            return this.unpack(faceSchema, data);
        });
    }
    getFaceSchema(faceName) {
        return __awaiter(this, void 0, void 0, function* () {
            let faceSchema = this.faceSchemas[faceName];
            if (faceSchema !== undefined)
                return faceSchema;
            let parts = faceName.split('/');
            if (parts.length !== 3)
                return;
            let busSchema = yield this.getBusSchema(parts[0], parts[1]);
            if (busSchema === undefined)
                return;
            faceSchema = this.faceSchemaFromBus(busSchema, parts[2]);
            if (faceSchema === undefined)
                return;
            let fs = this.buildFaceSchema(faceSchema, busSchema);
            this.faceSchemas[faceName] = fs;
            return fs;
        });
    }
    faceSchemaFromBus(busSchema, faceName) {
        if (busSchema === undefined)
            return;
        let faceSchema = busSchema[faceName];
        if (faceSchema === undefined)
            return;
        return faceSchema;
    }
    buildFaceSchema(faceSchema, busSchema) {
        let fields = [];
        let arrs = [];
        for (let item of faceSchema) {
            if (item.type === 'array') {
                let { name, fields } = item;
                let arr = {
                    name: name,
                    fields: busSchema[fields],
                };
                arrs.push(arr);
            }
            else {
                fields.push(item);
            }
        }
        return { fields: fields, arrs: arrs };
    }
    getBusSchema(owner, busName) {
        return __awaiter(this, void 0, void 0, function* () {
            let fullBusName = owner + '/' + busName;
            let busSchema = this.busSchemas[fullBusName];
            if (busSchema !== undefined)
                return busSchema;
            let text = yield centerApi_1.centerApi.busSchema(owner, busName);
            return this.busSchemas[fullBusName] = JSON.parse(text);
        });
    }
    pack(schema, data) {
        let result = [];
        if (data !== undefined) {
            if (Array.isArray(data) === false)
                data = [data];
            let len = data.length;
            for (let i = 0; i < len; i++)
                this.packBusMain(result, schema, data[0]);
        }
        return result.join('');
    }
    packBusMain(result, schema, main) {
        let { fields, arrs } = schema;
        this.packRow(result, fields, main);
        if (arrs !== undefined && arrs.length > 0) {
            for (let arr of arrs) {
                let { name, fields } = arr;
                this.packArr(result, fields, main[name]);
            }
            result.push(ln);
        }
        else {
            result.push(ln, ln, ln);
        }
    }
    escape(d) {
        //if (d === null) return '\b';
        if (d === null)
            return '';
        switch (typeof d) {
            default:
                if (d instanceof Date)
                    return d.getTime(); //-timezoneOffset-timezoneOffset;
                return d;
            case 'string':
                let len = d.length;
                let r = '', p = 0;
                for (let i = 0; i < len; i++) {
                    let c = d.charCodeAt(i);
                    switch (c) {
                        case 9:
                            r += d.substring(p, i) + '\\t';
                            p = i + 1;
                            break;
                        case 10:
                            r += d.substring(p, i) + '\\n';
                            p = i + 1;
                            break;
                    }
                }
                return r + d.substring(p);
            case 'undefined': return '';
        }
    }
    packRow(result, fields, data) {
        let ret = '';
        let len = fields.length;
        ret += this.escape(data[fields[0].name]);
        for (let i = 1; i < len; i++) {
            let f = fields[i];
            ret += tab + this.escape(data[f.name]);
        }
        result.push(ret + ln);
    }
    packArr(result, fields, data) {
        if (data !== undefined) {
            for (let row of data) {
                this.packRow(result, fields, row);
            }
        }
        result.push(ln);
    }
    unpack(schema, data) {
        let ret = {};
        if (schema === undefined || data === undefined)
            return;
        let fields = schema.fields;
        let p = 0;
        if (fields !== undefined)
            p = this.unpackRow(ret, schema.fields, data, p);
        let arrs = schema['arrs'];
        if (arrs !== undefined) {
            for (let arr of arrs) {
                p = this.unpackArr(ret, arr, data, p);
            }
        }
        return ret;
    }
    unpackRow(ret, fields, data, p) {
        let c = p, i = 0, len = data.length, fLen = fields.length;
        for (; p < len; p++) {
            let ch = data.charCodeAt(p);
            if (ch === 9) {
                let f = fields[i];
                let v = data.substring(c, p);
                ret[f.name] = to(v, f.type);
                c = p + 1;
                ++i;
                if (i >= fLen)
                    break;
            }
            else if (ch === 10) {
                let f = fields[i];
                let v = data.substring(c, p);
                ret[f.name] = to(v, f.type);
                ++p;
                ++i;
                break;
            }
        }
        return p;
        function to(v, type) {
            switch (type) {
                default: return v;
                case 'id':
                case 'number':
                case 'tinyint':
                case 'smallint':
                case 'int':
                case 'bigint':
                case 'dec': return Number(v);
            }
        }
    }
    unpackArr(ret, arr, data, p) {
        let vals = [], len = data.length;
        let { name, fields } = arr;
        while (p < len) {
            let ch = data.charCodeAt(p);
            if (ch === 10) {
                ++p;
                break;
            }
            let val = {};
            vals.push(val);
            p = this.unpackRow(val, fields, data, p);
        }
        ret[name] = vals;
        return p;
    }
}
exports.faceSchemas = new FaceSchemas;
//# sourceMappingURL=faceSchemas.js.map