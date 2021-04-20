import { Request, Response, Router } from "express";
import { search } from "./search";
import { epecLogin } from "../epec";
import { getProductsInCatalog } from "./getProductsInCatalog";
import { replacePostContentUrl } from "../tools/replacePostContentUrl";
import { clientLogin } from "../joint";

export const apiRouter = Router({ mergeParams: true });
apiRouter.get(['/search/:key', '/search/:key/:pageNumber(\\d+)', '/search/:key?debug'], search);
apiRouter.get('/product/search', search);
apiRouter.get(['/product-catalog/:catalog/products', '/product-catalog/:catalog/products/:pageNumber(\\d+)', '/product-catalog/:catalog/products?debug'], getProductsInCatalog);

// 中石化登录地址
apiRouter.get('/epec/login', epecLogin);
// 二次登录验证(要删除)
apiRouter.get('/epec/clientLogin', clientLogin);

// 药物所登录地址配置再legacyUrl中
// 二次登录验证
apiRouter.get('/joint/clientLogin', clientLogin);


// 临时用于修改贴文内容中旧的url 
apiRouter.get('/replacePostContentUrl/:from(\\d+)-:to(\\d+)', async (req: Request, rep: Response) => {
    let { params } = req;
    let { from, to } = params;
    let iFrom = parseInt(from);
    let iTo = parseInt(to);

    try {
        await replacePostContentUrl(iFrom, iTo);
        rep.end('ok');
    } catch (error) {
        rep.json(error);
    }
})