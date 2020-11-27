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
exports.xmlToJson = exports.wxOrderQuery = exports.wxPay = void 0;
const config = require("config");
const node_fetch_1 = require("node-fetch");
const _ = require('lodash');
const MD5 = require('md5');
const wxPayConf = config.get('wxPay');
function wxPay(order) {
    return __awaiter(this, void 0, void 0, function* () {
        let { wxPayParam } = wxPayConf;
        let nonce_str = createRandomStr();
        let { no, amount } = order;
        let params = {
            "nonce_str": nonce_str,
            "body": "百灵威购物-订单支付",
            "out_trade_no": no,
            "total_fee": 1,
            // "total_fee": amount * 100,//总金额
            "spbill_create_ip": "123.12.12.123",
            "trade_type": "APP",
            "sign_type": "MD5"
        };
        _.assign(params, wxPayParam);
        let sign = WXSign(params);
        params["sign"] = sign;
        let result = yield wxPayUnifyOrder(params);
        if (result.success)
            return JSON.stringify(result.result);
        return undefined;
    });
}
exports.wxPay = wxPay;
/** 微信统一下单 */
function wxPayUnifyOrder(params) {
    return __awaiter(this, void 0, void 0, function* () {
        let xml = toXML(params);
        let res = yield node_fetch_1.default("https://api.mch.weixin.qq.com/pay/unifiedorder", {
            method: 'post',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: JSON.stringify(xml)
        });
        if (res.ok) {
            let result = yield res.text();
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
                        result: Object.assign(Object.assign({}, wxpayParams), { "sign": signA })
                    };
                }
                else
                    return { success: false, message: err_code_des };
            }
            return { success: false, message: return_msg };
        }
        return { success: false, message: '下单失败' };
    });
}
;
/** 微信签名 */
function WXSign(params) {
    let stringA = sortASCIIToString(params);
    let key = wxPayConf.wxSecretKey; //商户平台设置的密钥key
    let stringSignTemp = stringA + "&key=" + key;
    let sign = MD5(stringSignTemp).toUpperCase();
    return sign;
}
/** 查看订单 */
function wxOrderQuery(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
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
        let resA = yield node_fetch_1.default("https://api.mch.weixin.qq.com/pay/orderquery", {
            method: 'post',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: JSON.stringify(xml)
        });
        if (resA.ok) {
            let result = yield resA.text();
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
    });
}
exports.wxOrderQuery = wxOrderQuery;
/** 时间戳 精确到秒的字符串 */
function createTimeStamp() {
    return parseInt((new Date().getTime() / 1000).toString()); //+ '';
}
;
/** 随机函数 不长于32位 */
function createRandomStr() {
    let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', str = '';
    for (let i = 0; i < 32; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return str;
}
;
/**
 * 参数按照参数名ASCII码从小到大排序  拼接成字符串
 * @param args
 */
function sortASCIIToString(args) {
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
function toXML(paramsObj) {
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
function xmlToJson(xmlStr) {
    xmlStr = xmlStr.replace(/(\s|<\/*xml\>)/g, '').replace(/\]*><\/\w+><*/g, ',').replace(/><!\[\w+\[/g, ':');
    xmlStr = xmlStr.slice(1, -1);
    let arr = xmlStr.split(',');
    let obj = {};
    for (let key of arr) {
        if (!key)
            continue;
        let newKey = key.split(':');
        obj[newKey[0]] = newKey[1];
    }
    return obj;
}
exports.xmlToJson = xmlToJson;
;
//# sourceMappingURL=wxPay.js.map