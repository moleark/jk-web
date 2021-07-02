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
exports.authentication = void 0;
const config = require("config");
const fast_xml_parser_1 = require("fast-xml-parser");
const db_1 = require("../db");
const logger_1 = require("../tools/logger");
var urlencode = require('urlencode');
// platformId = process.env.NODE_ENV === 'development' ? 5 : 4;
let { punchout_successRedirect, punchout_failRedirect, platformId } = config.get('punchout');
/**
 * 诺华用户认证接口
 * 1. 解析xml字符串 保存源数据
 * 2. 保存到业务表
 * 3. 用户验证登陆
 * @param req
 * @param res
 */
function authentication(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let responseXml;
        try {
            // 接收xml参数
            let xmlBody = yield getRequestData(req, res);
            if (!xmlBody) {
                responseXml = GenerateCxml("empty", 304, "cxml is empty", punchout_failRedirect);
            }
            else {
                logger_1.logger.info("punchout.aspx begin saveApirawContent");
                let { jointPlatform } = db_1.Dbs;
                yield jointPlatform.saveApirawContent(platformId, "PunchOut.aspx", xmlBody);
                // 解析为json字符串
                let jsonObj = fast_xml_parser_1.parse(xmlBody, {
                    attributeNamePrefix: "",
                    ignoreAttributes: false,
                });
                logger_1.logger.info("parse xml to Json save PunchOutSetupRequest ");
                let { Header: punchoutHeader, payloadID } = jsonObj.cXML;
                // 保存到业务表
                yield jointPlatform.savePunchOutSetupRequest(platformId, jsonObj, xmlBody);
                // 用户验证
                let neoUser = yield jointPlatform.getUserByLoginKey(punchoutHeader.Sender.Credential.SharedSecret);
                if (!neoUser) {
                    responseXml = GenerateCxml("failed", 305, "login faild", punchout_failRedirect);
                }
                else {
                    responseXml = GenerateCxml(payloadID, 200, "success", punchout_successRedirect + urlencode(punchoutHeader.Sender.Credential.SharedSecret));
                }
            }
        }
        catch (error) {
            logger_1.logger.error("PunchOut.aspx error:", error);
            responseXml = GenerateCxml("error", 305, "cxml format error", punchout_failRedirect);
        }
        finally {
            logger_1.logger.info('PurchOutRequest responseXml:', responseXml);
            return res.send(responseXml);
        }
    });
}
exports.authentication = authentication;
function getRequestData(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = '';
        return new Promise(function (resolve, reject) {
            req.setEncoding('utf8');
            req.on('data', function (chunk) {
                data += chunk;
            });
            req.on('end', function () {
                resolve(data);
            });
        });
    });
}
function GenerateCxml(payloadID, httpStatusCode, httpStatusMessage, startPageUrl) {
    let obj = {
        cXML: {
            _attrs: {
                'xml:lang': 'en-US',
                payloadID: payloadID,
                timestamp: new Date()
            },
            Response: {
                Status: {
                    _attrs: {
                        code: httpStatusCode,
                        text: httpStatusMessage
                    },
                },
                PunchOutSetupResponse: {
                    StartPage: {
                        URL: { "#text": startPageUrl }
                    }
                }
            }
        }
    };
    let objxml = new fast_xml_parser_1.j2xParser({
        format: false,
        attrNodeName: "_attrs",
        textNodeName: "#text",
        cdataTagName: "_cdata"
    }).parse(obj);
    return "<?xml version=\"1.0\" encoding=\"utf-8\"?><!DOCTYPE cXML SYSTEM \"http://xml.cxml.org/schemas/cXML/1.2.014/cXML.dtd\">" + objxml;
}
//# sourceMappingURL=PunchOut.js.map