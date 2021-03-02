import { Request, Response } from "express";
import { productService } from "../services/product/productService";

export async function getProductsInCatalog(req: Request, res: Response) {

    let { params, query } = req;
    let { catalog, pageNumber: pn } = params;
    let { debug } = query;
    let pageNumber: number = 1;
    if (pn)
        pageNumber = parseInt(pn);
    pageNumber = pageNumber < 1 ? 1 : pageNumber;

    let result = await productService.getProductsInCatalog(parseInt(catalog), pageNumber, 20, debug !== undefined);
    if (result)
        return res.json(result);
    else
        return res.status(500).end();
}