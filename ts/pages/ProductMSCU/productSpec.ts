import { Request, Response } from "express";
import * as config from 'config';
import { Dbs } from "../../db";
import { getFilePath } from "./getFilePath";

export async function productSpecFile(req: Request, res: Response, next: any) {

    let { productid, captcha } = req.params;
    let productId = Number(productid);
    let sessionCaptcha = req.session.captcha;
    let isCorrectCaptcha = String(captcha) === String(sessionCaptcha) ? true : false;
    if (isCorrectCaptcha) {
        const productPdfFile = await Dbs.productMSCU.getProductSpec(productId);
        if (productPdfFile && productPdfFile.filename) {
            let filePath = getFilePath('spec', productPdfFile.filename);
            await res.sendFile(filePath);
        } else
            res.status(404).end();
    } else
        res.status(412).end();
};