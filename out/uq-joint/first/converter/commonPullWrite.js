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
const salesRegion_1 = require("../../settings/in/salesRegion");
function PackTypePullWrite(joint, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield joint.uqIn(salesRegion_1.PackType, _.pick(data, ["ID", "UnitE", "UnitC"]));
            yield joint.uqIn(salesRegion_1.PackTypeMapToStandard, _.pick(data, ["ID", "StandardUnitID"]));
            return true;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    });
}
exports.PackTypePullWrite = PackTypePullWrite;
//# sourceMappingURL=commonPullWrite.js.map