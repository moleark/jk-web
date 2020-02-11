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
const uqs_1 = require("../uqs");
const dateformat_1 = require("dateformat");
exports.Employee = {
    uq: uqs_1.uqs.jkHr,
    type: 'tuid',
    entity: 'Employee',
    key: 'ID',
    mapper: {
        $id: 'ID@Employee',
        no: "ID",
        name: "ChineseName",
        firstName: "EpName1",
        lastName: "EpName2",
        title: "Title",
        status: "Status",
        CreateTime: "CreateTime",
    },
    pullWrite: (joint, data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            data["CreateTime"] = dateformat_1.default(data["CreateTime"], 'yyyy-mm-dd HH:MM:ss');
            yield joint.uqIn(exports.Employee, data);
            return true;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }),
};
//# sourceMappingURL=hr.js.map