import { Request, Response } from "express";
import { Dbs } from "../db";
import * as config from 'config';

const o = process.env.NODE_ENV === 'production'
    ? {
        196: "CN",
        38: "EN",
        35: "DE",
        56: "EN-US",
    }
    : {
        197: "CN",
        52: "EN",
        32: "DE",
        55: "EN-US",
    }

//delete
export async function productPdfFile(req: Request, res: Response, next: any) {

    let { productid, lang, captcha } = req.params;
    let productId = Number(productid);
    let langId = lang === 'undefined' ? undefined : Number(lang);
    let sessionCaptcha = req.session.captcha;
    // console.log(req.session);
    let isCorrectCaptcha = String(captcha) === String(sessionCaptcha) ? true : false;
    // let isCorrectCaptcha = String(captcha) === String(req.session.captcha) ? true : false;
    if (isCorrectCaptcha) {
        const productPdfFile = await Dbs.productMSCU.getProductMsds(productId, langId);
        if (productPdfFile && productPdfFile.filename) {
            let fileName = productPdfFile.filename;
            let fileAscr = langId !== undefined ? o[langId] : (fileName.includes('_EN') ? 'EN' : 'CN');
            let filePath = `${config.get("MSCUPath")}${langId !== undefined ? 'msds' : 'spec'}/${fileAscr}/${fileName}`;
            if (process.env.NODE_ENV !== 'production') filePath = config.get("MSCUPath") + fileName;
            await res.sendFile(filePath);//'100008_CN.PDF'
        } else {
            res.status(404).end();
        }
    } else {
        res.status(412).end();
    }
};