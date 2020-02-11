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
const express_1 = require("express");
//import { Runner, getRunner } from '../../db';
//import { consts } from '../../core';
//import { writeDataToBus } from '../../queue/processBusMessage';
const getIp_1 = require("./getIp");
const busPage_1 = require("./busPage");
const busExchange_1 = require("./busExchange");
function createRouter(settings) {
    let router = express_1.Router({ mergeParams: true });
    router.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
        yield routerProcess(req, res, busPage_1.busPage);
    }));
    router.post('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
        yield routerProcess(req, res, busExchange_1.busExchange);
    }));
    function routerProcess(req, res, action) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let reqIP = getIp_1.getClientIp(req);
                let innerIP = getIp_1.getIp(req);
                let netIP = getIp_1.getNetIp(req);
                if (getIp_1.validIp(settings.allowedIP, [innerIP, netIP]) === false) {
                    res.end('<div>Your IP ' + (netIP || innerIP || reqIP) + ' is not valid!</div>');
                    return;
                }
                yield action(req, res);
            }
            catch (err) {
                res.end('error: ' + err.message);
            }
        });
    }
    return router;
}
exports.createRouter = createRouter;
//# sourceMappingURL=router.js.map