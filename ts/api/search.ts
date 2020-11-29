import { Request, Response } from "express";
import { productService } from "../services/product/productService";

export async function search(req: Request, res: Response) {

    let { params } = req;
    let { key, pageStart } = params;
    let pageNumer: number = 0;
    if (pageStart)
        pageNumer = parseInt(pageStart);

    let result = await productService.search(key, pageNumer);
    return res.json(result);
}