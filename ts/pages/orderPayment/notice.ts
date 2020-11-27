import { Request, Response } from "express";
import { xmlToJson } from "./wxPay";

export async function wxNotice(req: Request, res: Response, next: any) {
    let { a } = req.params;
    let resJson = xmlToJson('');
    let { return_code } = resJson;
    if (return_code === 'SUCCESS') {
        res.send(resJson);
    }
    res.send({ return_code });
};

export async function aliNotice(req: Request, res: Response, next: any) {

    res.end();
};