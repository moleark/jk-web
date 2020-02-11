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
const _ = require("lodash");
const dateformat_1 = require("dateformat");
const uqs_1 = require("../uqs");
const config_1 = require("config");
const promiseSize = config_1.default.get("promiseSize");
exports.JkTaskType = {
    uq: uqs_1.uqs.jkSalestask,
    type: 'tuid',
    entity: 'JkTaskType',
    key: 'WorkTaskTypeID',
    mapper: {
        $id: 'WorkTaskTypeID@JkTaskType',
        no: "WorkTaskTypeID",
        name: "name",
        TimeLimit: 'TimeLimit',
    },
    pull: `select top ${promiseSize} ID, WorkTaskTypeID, WorkTaskTypeName as name, TimeLimit
           from ProdData.dbo.Export_DicWorkTaskType where id > @iMaxId order by id`,
};
exports.JkTask = {
    uq: uqs_1.uqs.jkSalestask,
    type: 'tuid',
    entity: 'JkTask',
    key: 'WorkTaskID',
    mapper: {
        $id: 'WorkTaskID@JkTask',
        no: "WorkTaskID",
        description: 'LinkObjectID',
        customer: 'CustomerID@Customer',
        type: 'typeid',
        biz: 'bizid',
        employee: "EmployeeID@Employee",
        sourceNo: 'LinkObjectID',
        priorty: 'TimeLimit',
        deadline: 'RequireCompletionTime',
        createTime: 'CreateTime',
        completeTime: 'CompleteTime',
    },
    pull: `select   top ${promiseSize} a.ID, a.WorkTaskID, a.WorkTaskSource, a.CustomerID, b.typeid, b.bizid, a.EmployeeID, 
                    a.LinkObjectID, isnull(a.TimeLimit,0) as TimeLimit, a.RequireCompletionTime, a.CreateTime, a.CompleteTime
            from    ProdData.dbo.Export_WorkTask as a
                    inner join ProdData.dbo.TaskBiz as b on a.WorkTaskTypeID = b.jktypeid
            where a.ID > @iMaxId order by a.ID`,
    pullWrite: (joint, data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            data["RequireCompletionTime"] = data["RequireCompletionTime"] && dateformat_1.default(data["RequireCompletionTime"], "yyyy-mm-dd");
            data["CreateTime"] = data["CreateTime"] && dateformat_1.default(data["CreateTime"], "yyyy-mm-dd");
            yield joint.uqIn(exports.JkTask, _.pick(data, ["ID", "WorkTaskID", "WorkTaskSource", "CustomerID", "typeid", "bizid", "EmployeeID", 'LinkObjectID', 'TimeLimit', 'RequireCompletionTime', 'CreateTime']));
            return true;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }),
};
//# sourceMappingURL=salestask.js.map