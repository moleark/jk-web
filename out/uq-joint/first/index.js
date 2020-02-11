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
const config_1 = require("config");
const settings_1 = require("../settings");
const uq_joint_1 = require("../uq-joint");
const pulls_1 = require("./pulls");
const uqOutRead_1 = require("./converter/uqOutRead");
//import { host } from "../uq-joint/tool/host";
//import { centerApi } from "../uq-joint/tool/centerApi";
const tools_1 = require("../mssql/tools");
const maxRows = config_1.default.get("firstMaxRows");
const promiseSize = config_1.default.get("promiseSize");
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(process.env.NODE_ENV);
        //await host.start();
        //centerApi.initBaseUrl(host.centerUrl);
        yield tools_1.initMssqlPool();
        //let joint = new Joint(settings);
        let joint = new uq_joint_1.TestJoint(settings_1.settings);
        //let joint = new ProdJoint(settings);
        console.log('start');
        let start = Date.now();
        let priorEnd = start;
        for (var i = 0; i < pulls_1.pulls.length; i++) {
            let { read, uqIn } = pulls_1.pulls[i];
            let { entity, pullWrite, firstPullWrite } = uqIn;
            console.log(entity + " start at " + new Date());
            let readFunc;
            if (typeof (read) === 'string') {
                readFunc = function (maxId) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield uqOutRead_1.uqOutRead(read, maxId);
                    });
                };
            }
            else {
                readFunc = read;
            }
            let maxId = '', count = 0;
            let promises = [];
            for (;;) {
                let ret;
                try {
                    ret = yield readFunc(maxId);
                }
                catch (error) {
                    console.error(error);
                    throw error;
                }
                if (ret === undefined || count > maxRows)
                    break;
                let { lastPointer, data: rows } = ret;
                rows.forEach(e => {
                    if (firstPullWrite !== undefined) {
                        promises.push(firstPullWrite(joint, e));
                    }
                    else if (pullWrite !== undefined) {
                        promises.push(pullWrite(joint, e));
                    }
                    else {
                        promises.push(joint.uqIn(uqIn, e));
                    }
                    count++;
                });
                maxId = lastPointer;
                try {
                    yield pushToTonva(promises, start, priorEnd, count, lastPointer);
                }
                catch (error) {
                    console.error(error);
                    if (error.code === "ETIMEDOUT") {
                        yield pushToTonva(promises, start, priorEnd, count, lastPointer);
                    }
                    else {
                        throw error;
                    }
                }
            }
            try {
                yield Promise.all(promises);
            }
            catch (error) {
                // debugger;
                console.error(error);
                throw error;
            }
            promises.splice(0);
            console.log(entity + " end   at " + new Date());
        }
        ;
        process.exit();
    });
})();
function pushToTonva(promises, start, priorEnd, count, lastPointer) {
    return __awaiter(this, void 0, void 0, function* () {
        if (promises.length >= promiseSize) {
            let before = Date.now();
            yield Promise.all(promises);
            promises.splice(0);
            let after = Date.now();
            let sum = Math.round((after - start) / 1000);
            let each = Math.round(after - priorEnd);
            let eachSubmit = Math.round(after - before);
            console.log('count = ' + count + ' each: ' + each + ' sum: ' + sum + ' eachSubmit: ' + eachSubmit + 'ms; lastId: ' + lastPointer);
            priorEnd = after;
        }
    });
}
//# sourceMappingURL=index.js.map