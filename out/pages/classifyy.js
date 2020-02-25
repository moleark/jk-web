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
const data_1 = require("../data");
const tools_1 = require("../tools");
const tools_2 = require("../tools");
function classifyy(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let index = req.params.index;
        let current = req.params.current;
        // let rootPath = getRootPath(req);
        // console.log(rootPath,'curr')
        let data = tools_2.buildData(req, {
            title: data_1.categories[current].caption,
            index: index,
            current: current,
            categories: data_1.categories,
        });
        res.render('classifyy.ejs', data, (err, html) => {
            if (tools_1.ejsError(err, res) === true)
                return;
            res.end(html);
        });
    });
}
exports.classifyy = classifyy;
;
//# sourceMappingURL=classifyy.js.map