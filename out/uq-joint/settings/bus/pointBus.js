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
const webApiClient_1 = require("../../tools/webApiClient");
const uqOutRead_1 = require("../../first/converter/uqOutRead");
const facePointPush = (joint, uqBus, queue, data) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(data);
    // 调用7.253的web api
    // let httpClient = new WebApiClient();
    let ret = yield webApiClient_1.httpClient.test({});
    return true;
});
const facePointPull = (joint, uqBus, queue) => __awaiter(void 0, void 0, void 0, function* () {
    let sql = `select top 1 ID, CID, Years, AllScore, ScoreUsed from ProdData.dbo.Export_CustomerScoreBook where ID > @iMaxId order by ID`;
    return yield uqOutRead_1.uqOutRead(sql, queue);
});
exports.facePoint = {
    face: '百灵威系统工程部/point/point',
    mapper: {
        member: 'CID@Customer',
        years: 'Years',
        point: "AllScore",
        pointUsed: "ScoreUsed",
    },
    push: facePointPush,
    pull: facePointPull
};
//# sourceMappingURL=pointBus.js.map