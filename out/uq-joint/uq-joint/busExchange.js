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
const tool_1 = require("./db/mysql/tool");
const database_1 = require("./db/mysql/database");
let lastHour;
;
function busExchange(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let tickets = req.body;
        if (Array.isArray(tickets) === false)
            tickets = [tickets];
        let ret = [];
        let hour = Math.floor(Date.now() / (3600 * 1000));
        if (lastHour === undefined || hour > lastHour) {
            let inc = hour * 1000000000;
            yield tool_1.execSql(database_1.alterTableIncrement('queue_out', inc));
            yield tool_1.execSql(database_1.alterTableIncrement('queue_in', inc));
            lastHour = hour;
        }
        for (let ticket of tickets) {
            let { moniker, queue, data } = ticket;
            if (moniker === undefined)
                continue;
            if (data !== undefined) {
                yield tool_1.execProc('write_queue_in', [moniker, JSON.stringify(data)]);
            }
            else {
                let q = Number(queue);
                if (Number.isNaN(q) === false) {
                    let readQueue = yield tool_1.tableFromProc('read_queue_out', [moniker, q]);
                    if (readQueue.length > 0) {
                        ret.push(readQueue[0]);
                    }
                }
            }
        }
        res.json(ret);
    });
}
exports.busExchange = busExchange;
//# sourceMappingURL=busExchange.js.map