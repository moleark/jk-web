import { Request, Response } from "express";
import { productService } from "../services/product/productService";

export async function search(req: Request, res: Response) {

    let { params } = req;
    let { key, pageNumber: pn } = params;
    let pageNumber: number = 1;
    if (pn)
        pageNumber = parseInt(pn);
    pageNumber = pageNumber < 1 ? 1 : pageNumber;

    let result = await productService.search(key, pageNumber);
    return res.json(result);
}