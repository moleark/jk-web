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
const ejs = require("ejs");
const _ = require("lodash");
const db_1 = require("../db");
const tools_1 = require("../tools");
function product(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let id = req.params.id;
        const [retProduct, retChemical] = yield Promise.all([
            db_1.Db.product.execProc('tv_productx', [db_1.Db.unit, 0, id]),
            db_1.Db.product.tableFromProc('tv_productchemical$query$', [db_1.Db.unit, 0, id, null]),
        ]);
        let product = retProduct[0][0];
        if (!product) {
            res.end('product ' + id + ' not exists!');
            return;
        }
        let packs = retProduct[1];
        let chemical = retChemical[0];
        if (chemical) {
            _.merge(product, chemical);
        }
        yield loadAllPropIds(product);
        //let template: string, title: string;
        //let m = device(req)? '-m' : '';
        let header = ejs.fileLoader(tools_1.viewPath + 'headers/header' + tools_1.ejsSuffix).toString();
        let homeHeader = ejs.fileLoader(tools_1.viewPath + 'headers/home-header' + tools_1.ejsSuffix).toString();
        let homeFooter = ejs.fileLoader(tools_1.viewPath + 'footers/home-footer' + tools_1.ejsSuffix).toString();
        let body = ejs.fileLoader(tools_1.viewPath + 'product.ejs').toString();
        let template = header + homeHeader
            + '<div class="container my-3">'
            + body
            + '</div>'
            + homeFooter;
        let data = tools_1.buildData(req, {
            product: product,
            packs: packs
        });
        let html = ejs.render(template, data);
        res.end(html);
    });
}
exports.product = product;
;
const propDefs = [
    { name: 'brand', proc: 'tv_brand$ids' }
];
function loadAllPropIds(product) {
    return __awaiter(this, void 0, void 0, function* () {
        let promises = [];
        for (let propDef of propDefs) {
            promises.push(loadPropIds(product, propDef));
        }
        yield Promise.all(promises);
    });
}
function loadPropIds(product, propDef) {
    return __awaiter(this, void 0, void 0, function* () {
        let { name: propName, proc } = propDef;
        let ids = [];
        let propColl = {};
        let { id } = product;
        let prop = product[propName];
        let coll = propColl[prop];
        if (coll === undefined) {
            propColl[prop] = coll = [];
            ids.push(prop);
        }
        coll.push(product);
        let ret = yield db_1.Db.product.tableFromProc(proc, [db_1.Db.unit, 0, ids.join(',')]);
        for (let b of ret) {
            let { id } = b;
            let coll = propColl[id];
            if (!coll)
                continue;
            for (let p of coll)
                p[propName] = b;
        }
    });
}
//# sourceMappingURL=product.js.map