import { Request, Response } from "express";
import * as config from 'config';
import { Dbs } from "../../db";
import * as fs from 'fs';
import { getFilePath } from "./getFilePath";


export async function productMsdsFile(req: Request, res: Response, next: any) {

    let { productid, lang, captcha } = req.params;
    let productId = Number(productid);
    let langId = lang === 'undefined' ? undefined : Number(lang);
    let sessionCaptcha = req.session.captcha;
    let isCorrectCaptcha = String(captcha) === String(sessionCaptcha) ? true : false;
    if (isCorrectCaptcha) {
        const productPdfFile = await Dbs.productMSCU.getProductMsds(productId, langId);
        if (productPdfFile && productPdfFile.filename) {
            let filePath = getFilePath('msds', productPdfFile.filename, langId);
            await res.sendFile(filePath);
        } else {
            res.status(404).end();
        }
    } else {
        res.status(412).end();
    }
};


/**
 * 
 * @param req 
 * @param res 
 * @param next 
 */
export async function productMsdsVersions(req: Request, res: Response, next: any) {

    let { origin } = req.params;
    let versions = await Dbs.productMSCU.getProductMsdsVersions(origin);
    if (versions && versions.length > 0) {
        let o = config.get('FILELANGVER');
        let result = versions.map((v: any) => { return { language: o[v.language], origin: v.origin } });
        res.json(result);
    }
    else res.status(404).end();
};

/**
 * 根据编号获取指定产品及语言的Msds文件
 * @param req
 * @param res
 * @param next
 */
export async function productMsdsFileByOrigin(req: Request, res: Response, next: any) {

    let { origin, lang, captcha } = req.params;
    let sessionCaptcha = req.session.captcha;
    let isCorrectCaptcha = String(captcha) === String(sessionCaptcha) ? true : false;
    if (isCorrectCaptcha) {
        let versions = await Dbs.productMSCU.getProductMsdsVersions(origin);
        if (versions) {
            let o = config.get('FILELANGVER');
            let productMsdsFile = versions.find((v: any) => o[v.language] === lang);
            if (productMsdsFile && productMsdsFile.filename) {
                let filePath = getFilePath('msds', productMsdsFile.filename, productMsdsFile.language);
                await res.sendFile(filePath);
            } else
                res.status(404).end();
        } else
            res.status(404).end();
    } else
        res.status(400).end();
};

