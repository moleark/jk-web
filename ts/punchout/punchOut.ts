import * as config from 'config';
import { Request, Response } from "express";
import { parse, j2xParser } from "fast-xml-parser";
import { Dbs } from "../db";
import { logger } from "../tools/logger";
import { format } from 'date-fns';
var urlencode = require('urlencode');

// platformId = process.env.NODE_ENV === 'development' ? 5 : 4;
let { punchout_successRedirect, punchout_failRedirect, platformId } = config.get<any>('punchout');


/**
 * 诺华用户认证接口
 * 1. 解析xml字符串 保存源数据
 * 2. 保存到业务表
 * 3. 用户验证登陆
 * @param req
 * @param res
 */
export async function authentication(req: Request, res: Response) {

    let responseXml: string;
    try {
        // 接收xml参数
        let xmlBody: any = await getRequestData(req, res);

        if (!xmlBody) {
            responseXml = GenerateCxml("empty", 304, "cxml is empty", punchout_failRedirect);
        }
        else {
            logger.info("punchout.aspx begin saveApirawContent");

            let { jointPlatform } = Dbs;
            await jointPlatform.saveApirawContent(platformId, "PunchOut.aspx", xmlBody);

            // 解析为json字符串
            let jsonObj = parse(xmlBody, {
                attributeNamePrefix: "",
                ignoreAttributes: false,
            });

            logger.info("parse xml to Json save PunchOutSetupRequest ");
            let { Header: punchoutHeader, payloadID } = jsonObj.cXML;

            // 保存到业务表
            await jointPlatform.savePunchOutSetupRequest(platformId, jsonObj, xmlBody);

            // 用户验证
            let neoUser = await jointPlatform.getUserByLoginKey(punchoutHeader.Sender.Credential.SharedSecret);
            if (!neoUser) {
                responseXml = GenerateCxml("failed", 305, "login faild", punchout_failRedirect);
            }
            else {
                responseXml = GenerateCxml(payloadID, 200, "success", punchout_successRedirect + urlencode(punchoutHeader.Sender.Credential.SharedSecret))
            }
        }
    } catch (error) {
        logger.error("PunchOut.aspx error:", error)
        responseXml = GenerateCxml("error", 305, "cxml format error", punchout_failRedirect);
    } finally {
        logger.info('PurchOutRequest responseXml:', responseXml);
        return res.send(responseXml);
    }
}


async function getRequestData(req: Request, res: Response) {

    let data: any = '';
    return new Promise(function (resolve, reject) {
        req.setEncoding('utf8');
        req.on('data', function (chunk) {
            data += chunk;
        });
        req.on('end', function () {
            resolve(data);
        });
    });
}


function GenerateCxml(payloadID: string, httpStatusCode: number, httpStatusMessage: string, startPageUrl: string) {

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

    let objxml = new j2xParser({
        format: false,
        attrNodeName: "_attrs",
        textNodeName: "#text",
        cdataTagName: "_cdata"
    }).parse(obj);

    return "<?xml version=\"1.0\" encoding=\"utf-8\"?><!DOCTYPE cXML SYSTEM \"http://xml.cxml.org/schemas/cXML/1.2.014/cXML.dtd\">" + objxml;
}





