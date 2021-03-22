import { NextFunction, Request, Response } from "express";
import { productService } from "../services/product/productService";

export async function search(req: Request, res: Response, next: NextFunction) {

    let { params, query } = req;
    let { key: key_p, pageNumber: pn_p } = params;
    let { key: key_q, pageNumber: pn_q, debug } = query;

    let pageNumber: number = 1;
    let pn = pn_p || pn_q;
    let key = key_p || key_q;
    if (pn)
        pageNumber = parseInt(pn);
    pageNumber = pageNumber < 1 ? 1 : pageNumber;

    let result = await productService.search(key, pageNumber, 20, debug !== undefined);
    if (result)
        return res.json(result);
    else {
        res.status(500);
        next();
    }
}