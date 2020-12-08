import * as config from 'config';
import { Request, Response } from 'express';
import fetch from "node-fetch";

const _ = require('lodash');
const MD5 = require('md5');

const wxPayConf = config.get<any>('wxPay');

export async function wxPay(order: any) {
    let { wxPayParam } = wxPayConf;
    let nonce_str = createRandomStr();
    let { no, amount } = order;
    let params: any = {
        "nonce_str": nonce_str,//随机字符串
        "body": "百灵威购物-订单支付",//商品描述
        "out_trade_no": no,//商户订单号
        "total_fee": 1,//总金额
        // "total_fee": amount * 100,//总金额
        "spbill_create_ip": "123.12.12.123",//终端IP
        "trade_type": "APP",//交易类型
        "sign_type": "MD5"
    };
    _.assign(params, wxPayParam);
    let sign = WXSign(params);
    params["sign"] = sign;
    let result = await wxPayUnifyOrder(params);
    if (result.success) return JSON.stringify(result.result);
    return undefined;
}

/** 微信统一下单 */
async function wxPayUnifyOrder(params: any) {
    let xml = toXML(params);
    let res = await fetch("https://api.mch.weixin.qq.com/pay/unifiedorder", {
        method: 'post',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: JSON.stringify(xml)
    });
    if (res.ok) {
        let result = await res.text();
        let resJson = xmlToJson(result);
        // console.log(resJson);
        let { return_code, return_msg, appid, mch_id, nonce_str, sign, prepay_id, result_code, err_code_des, err_code } = resJson;
        if (return_code === 'SUCCESS') {
            if (result_code === 'SUCCESS') {
                let wxpayParams = {
                    "appid": appid,
                    "noncestr": nonce_str,
                    "package": "Sign=WXPay",
                    "partnerid": mch_id,
                    "prepayid": prepay_id,
                    "timestamp": createTimeStamp(),
                };
                let signA = WXSign(wxpayParams);
                return {
                    success: true,
                    message: return_msg,
                    result: {
                        ...wxpayParams,
                        "sign": signA
                    }
                }
            } else
                return { success: false, message: err_code_des };
        }
        return { success: false, message: return_msg };
    }
    return { success: false, message: '下单失败' };
};

/** 微信签名 */
function WXSign(params: any) {
    let stringA: string = sortASCIIToString(params);
    let key = wxPayConf.wxSecretKey;//商户平台设置的密钥key
    let stringSignTemp = stringA + "&key=" + key;
    let sign = MD5(stringSignTemp).toUpperCase();
    return sign;
}

/** 查看订单 */
export async function wxOrderQuery(req: Request, res: Response, next: any) {
    let { orderid } = req.params;
    let { wxPayParam } = wxPayConf;
    let param = {
        "appid": wxPayParam.appid,
        "mch_id": wxPayParam.mch_id,
        "out_trade_no": orderid,
        "nonce_str": createRandomStr()
    };
    let sign = WXSign(param);
    param["sign"] = sign;
    let xml = toXML(param);
    let resA = await fetch("https://api.mch.weixin.qq.com/pay/orderquery", {
        method: 'post',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: JSON.stringify(xml)
    });
    if (resA.ok) {
        let result = await resA.text();
        let resJson = xmlToJson(result);
        let { return_code, return_msg, appid, mch_id, openid, total_fee, out_trade_no, transaction_id, fee_type, result_code, err_code_des, trade_state_desc } = resJson;
        if (return_code === 'SUCCESS') {
            if (result_code === 'SUCCESS') {
                res.send({
                    success: true,
                    message: trade_state_desc,
                    result: {
                        "appid": appid,
                        "mch_id": mch_id,
                        "out_trade_no": out_trade_no,
                        "openid": openid,
                        "total_fee": total_fee * 100,
                        "fee_type": fee_type,
                        "transaction_id": transaction_id,
                        "trade_state_desc": trade_state_desc,
                    }
                });
                // res.send(resJson);
            }
            res.send({ success: false, message: err_code_des });
        }
        res.send({ success: false, message: return_msg });
    }
}

/** 时间戳 精确到秒的字符串 */
function createTimeStamp() {
    return parseInt((new Date().getTime() / 1000).toString()) //+ '';
};

/** 随机函数 不长于32位 */
function createRandomStr() {
    let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', str = '';
    for (let i = 0; i < 32; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return str;
};

/**
 * 参数按照参数名ASCII码从小到大排序  拼接成字符串
 * @param args
 */
function sortASCIIToString(args: any) {
    return Object.keys(args).sort().map((key) => {
        if (args[key] !== "" && args[key] !== 'undefined' && key !== 'sign')
            return `${key}=${args[key]}`;
    }).join('&');
    /* let keys = Object.keys(args).sort();
    let newArgs = {};
    for (let key of keys) {
        if (args[key] !== "" && args[key] !== 'undefined' && key !== 'sign')
            newArgs[key] = args[key];
    }
    let string = '';
    for (let k in newArgs) {
        string += '&' + k + '=' + newArgs[k];
    }
    string = string.substr(1);
    return string; */
}

/**
 * 转XML
 * @param paramsObj
 */
function toXML(paramsObj: any) {
    let xml = "<xml>\n";
    for (let key in paramsObj) {
        xml += `<${key}>${paramsObj[key]}</${key}>\n`;
    }
    xml += "</xml>";
    return xml;
}

/**
 * XML转Json
 * @param xmlStr
 */
export function xmlToJson(xmlStr: string) {
    xmlStr = xmlStr.replace(/(\s|<\/*xml\>)/g, '').replace(/\]*><\/\w+><*/g, ',').replace(/><!\[\w+\[/g, ':');
    xmlStr = xmlStr.slice(1, -1);
    let arr = xmlStr.split(',');
    let obj: any = {};
    for (let key of arr) {
        if (!key) continue;
        let newKey: string[] = key.split(':');
        obj[newKey[0]] = newKey[1];
    }
    return obj;
};