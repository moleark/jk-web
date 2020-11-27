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
exports.changeTwoDecimal_f = exports.aliPay = void 0;
const alipay_sdk_1 = require("alipay-sdk");
const config = require("config");
const iconv = require("iconv-lite");
const snakeCaseKeys = require("snakecase-keys");
const _ = require('lodash');
const dateFormat = require('dateformat');
const crypto = require('crypto');
const fs = require('fs');
const x509_1 = require('@fidm/x509');
const bignumber_js_2 = require("bignumber.js");
const ALIPAY_ALGORITHM_MAPPING = {
    RSA: 'RSA-SHA1',
    RSA2: 'RSA-SHA256',
};
const aliPayConf = config.get('aliPay');
function aliPay(order) {
    return __awaiter(this, void 0, void 0, function* () {
        let { no, product, pack, amount } = order;
        let biz_content = {
            "timeout_express": "90m",
            "total_amount": changeTwoDecimal_f(amount),
            "product_code": "QUICK_MSECURITY_PAY",
            "body": "百灵威购物-订单支付",
            "subject": `${product},${pack}`,
            "out_trade_no": no,
        };
        let bizContent = {};
        Object.keys(biz_content).sort().forEach((key) => {
            bizContent[key] = biz_content[key];
        });
        /* let ress = await fetch('http://demo.dcloud.net.cn/payment/?payid=alipay&appid=2015112700878442&total=2');
        if (ress.ok) {
            let ass = await ress.text();
            console.log('121', ass);
            return ass;
        } */
        let { aliPayParam } = aliPayConf;
        let othersParam = {
            "method": "alipay.trade.app.pay",
            "format": "json",
            "charset": "utf-8",
            "signType": "RSA2",
            "version": "1.0",
        };
        let aliCretSN = yield getALiCretSN(aliPayParam.appId);
        aliPayParam = Object.assign(Object.assign(Object.assign({}, aliPayParam), othersParam), aliCretSN);
        // aliPayParam.alipayRootCertSn = aliPayParam.appCertSn = undefined;
        let signatureObj = sign({ bizContent }, aliPayParam);
        // console.log('signatureObj', signatureObj);
        signatureObj.sign_type = aliPayParam.signType;
        let signatureStr = Object.keys(signatureObj).sort().map((key) => {
            let data = signatureObj[key];
            if (Array.prototype.toString.call(data) !== '[object String]')
                data = JSON.stringify(data);
            if (key === 'sign')
                return '';
            return `${key}=${encodeURIComponent(data)}`;
        }).join('&');
        console.log(signatureStr);
        // return signatureStr + '&sign=' + encodeURIComponent(signatureObj["sign"]);
        return "alipay_sdk=alipay-sdk-nodejs-3.1.5&" + signatureStr + '&sign=' + encodeURIComponent(signatureObj["sign"]);
    });
}
exports.aliPay = aliPay;
/** 获取证书SN */
function getALiCretSN(appId) {
    return __awaiter(this, void 0, void 0, function* () {
        let { aliCretPath } = aliPayConf;
        let privateKeyTypeD = "PKCS1";
        const privateKeyType = privateKeyTypeD === 'PKCS8' ? 'PRIVATE KEY' : 'RSA PRIVATE KEY';
        /* personal */
        let appCertSn = getSNFromPath(aliCretPath + 'appCertPublicKey.crt', false);
        let alipayRootCertSn = getSNFromPath(aliCretPath + 'alipayRootCert.crt', true);
        let privatePem = fs.readFileSync(aliCretPath + 'private-key.pem', 'ascii');
        let privateKey = formatKey(privatePem, privateKeyType);
        // return { appCertSn, alipayRootCertSn, privateKey };
        /* sdk */
        const alipaySdk = new alipay_sdk_1.default({
            appId: appId,
            keyType: "PKCS1",
            privateKey: fs.readFileSync(aliCretPath + 'private-key.pem', 'ascii'),
            alipayRootCertPath: aliCretPath + 'alipayRootCert.crt',
            appCertPath: aliCretPath + 'appCertPublicKey.crt',
            alipayPublicCertPath: aliCretPath + 'alipayCertPublicKey_RSA2.crt',
        });
        console.log(alipaySdk);
        return {
            appCertSn: alipaySdk.config.appCertSn,
            alipayRootCertSn: alipaySdk.config.alipayRootCertSn,
            privateKey: alipaySdk.config.privateKey
        };
    });
}
;
/** 签名 */
function sign(params = {}, conf) {
    let signParams = Object.assign({
        appId: conf.appId,
        method: conf.method,
        format: conf.format,
        charset: conf.charset,
        version: conf.version,
        // signType: conf.signType,
        timestamp: dateFormat(new Date(), "yyyy-mm-dd HH:mm:ss"),
        notify_url: conf.notify_url
    }, _.omit(params, ['bizContent']));
    if (conf.appCertSn && conf.alipayRootCertSn) {
        signParams = Object.assign({
            appCertSn: conf.appCertSn,
            alipayRootCertSn: conf.alipayRootCertSn,
        }, signParams);
    }
    ;
    signParams.bizContent = JSON.stringify(snakeCaseKeys(params.bizContent));
    /* params key 驼峰转下划线 */
    const decamelizeParams = snakeCaseKeys(signParams);
    console.log('decamelizeParams', decamelizeParams);
    /* 排序 */
    let signStr = Object.keys(decamelizeParams).sort().map((key) => {
        let data = decamelizeParams[key];
        if (Array.prototype.toString.call(data) !== '[object String]')
            data = JSON.stringify(data);
        return `${key}=${iconv.encode(data, 'utf-8')}`;
    }).join('&');
    /* 计算签名 */
    const sign = crypto.createSign(ALIPAY_ALGORITHM_MAPPING[conf.signType])
        .update(signStr, 'utf8').sign(conf.privateKey, 'base64');
    return Object.assign(decamelizeParams, { sign });
}
;
function changeTwoDecimal_f(x) {
    let f_x = parseFloat(x);
    f_x = Math.round(x * 100) / 100;
    let s_x = f_x.toString();
    let pos_decimal = s_x.indexOf('.');
    if (pos_decimal < 0) {
        pos_decimal = s_x.length;
        s_x += '.';
    }
    while (s_x.length <= pos_decimal + 2) {
        s_x += '0';
    }
    return s_x;
}
exports.changeTwoDecimal_f = changeTwoDecimal_f;
/** 格式化 key */
function formatKey(key, type) {
    const item = key.split('\n').map(val => val.trim());
    // 删除包含 `RSA PRIVATE KEY / PUBLIC KEY` 等字样的第一行
    if (item[0].includes(type))
        item.shift();
    // 删除包含 `RSA PRIVATE KEY / PUBLIC KEY` 等字样的最后一行
    if (item[item.length - 1].includes(type))
        item.pop();
    return `-----BEGIN ${type}-----\n${item.join('')}\n-----END ${type}-----`;
}
;
/** 从证书文件里读取序列号 */
function getSNFromPath(filePath, isRoot = false) {
    const fileData = fs.readFileSync(filePath);
    return getSN(fileData, isRoot);
}
;
/** 从上传的证书内容或Buffer读取序列号 */
function getSN(fileData, isRoot = false) {
    if (typeof fileData == 'string') {
        fileData = Buffer.from(fileData);
    }
    if (isRoot) {
        return getRootCertSN(fileData);
    }
    const certificate = x509_1.Certificate.fromPEM(fileData);
    return getCertSN(certificate);
}
;
/** 读取序列号 */
function getCertSN(certificate) {
    const { issuer, serialNumber } = certificate;
    const principalName = issuer.attributes
        .reduceRight((prev, curr) => {
        const { shortName, value } = curr;
        const result = `${prev}${shortName}=${value},`;
        return result;
    }, '')
        .slice(0, -1);
    const decimalNumber = new bignumber_js_2.default(serialNumber, 16).toString(10);
    const SN = crypto
        .createHash('md5')
        .update(principalName + decimalNumber, 'utf8')
        .digest('hex');
    return SN;
}
;
/** 读取根证书序列号 */
function getRootCertSN(rootContent) {
    const certificates = x509_1.Certificate.fromPEMs(rootContent);
    console.log(certificates);
    let rootCertSN = '';
    certificates.forEach((item) => {
        if (item.signatureOID.startsWith('1.2.840.113549.1.1')) {
            const SN = getCertSN(item);
            if (rootCertSN.length === 0)
                rootCertSN += SN;
            else
                rootCertSN += `_${SN}`;
        }
    });
    return rootCertSN;
}
;
//# sourceMappingURL=aliPay.js.map