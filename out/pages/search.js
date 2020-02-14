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
const db_1 = require("../db");
const tools_1 = require("../tools");
function search(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let key = req.params.key;
        if (!key)
            key = req.query.key;
        const ret = yield db_1.Db.product.execProc('tv_searchproduct', [db_1.Db.unit, 0, null, 30, key, 4]);
        let products = ret[0];
        yield loadAllPropIds(products);
        let template, title;
        let header = ejs.fileLoader(tools_1.viewPath + 'headers/header' + tools_1.ejsSuffix).toString();
        let homeHeader = ejs.fileLoader(tools_1.viewPath + 'headers/home-header' + tools_1.ejsSuffix).toString();
        let homeFooter = ejs.fileLoader(tools_1.viewPath + 'footers/home-footer' + tools_1.ejsSuffix).toString();
        let body = ejs.fileLoader(tools_1.viewPath + 'search.ejs').toString();
        template = header + homeHeader
            + '<div class="container my-3">'
            + body
            + '</div>'
            + homeFooter;
        //let content = ejs.fileLoader('./ejs/a.ejs').toString();
        let data = tools_1.buildData(req, {
            products: products,
        });
        let html = ejs.render(template, data);
        res.end(html);
    });
}
exports.search = search;
;
const propDefs = [
    { name: 'brand', proc: 'tv_brand$ids' }
];
function loadAllPropIds(products) {
    return __awaiter(this, void 0, void 0, function* () {
        let promises = [];
        for (let propDef of propDefs) {
            promises.push(loadPropIds(products, propDef));
        }
        yield Promise.all(promises);
    });
}
function loadPropIds(products, propDef) {
    return __awaiter(this, void 0, void 0, function* () {
        let { name: propName, proc } = propDef;
        let ids = [];
        let propColl = {};
        for (let product of products) {
            let { id } = product;
            let prop = product[propName];
            if (!prop)
                continue;
            let coll = propColl[prop];
            if (coll === undefined) {
                propColl[prop] = coll = [];
                ids.push(prop);
            }
            coll.push(product);
        }
        if (ids.length === 0)
            return;
        let text = ids.join(',');
        let ret = yield db_1.Db.product.tableFromProc(proc, [db_1.Db.unit, 0, text]);
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
//# sourceMappingURL=search.js.map