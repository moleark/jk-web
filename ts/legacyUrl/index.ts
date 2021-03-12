import { Router, Request, Response } from 'express';
import { replace } from 'lodash';
import { Dbs } from '../db';

export const legacyRouter = Router({ mergeParams: true });
legacyRouter.get(/^\/CH\/products\/(.+?)\.html$/i, async (req: Request, res: Response) => {
    let oldProductId = req.params[0];
    let product = await Dbs.product.getProductByNo(oldProductId);
    if (product) {
        res.redirect('/product/' + product.id);
    }
});
legacyRouter.get(/^\/CH\/products\/search\/fulltextsearch\/(.+?)\.html$/i, async (req: Request, res: Response) => {

    res.redirect("/search/" + req.params[0]);
});
legacyRouter.get([/^\/zh-cn\/product-catalog\/parent\/(\d+)\.html$/i,
    /^\/zh-cn\/product-catalog\/(\d+)(\/\d+\/\d+)?.html$/i,
    /^\/CH\/products\/search\/productcategory\/(\d+)(\/\d+)?.html$/i],
    async (req: Request, res: Response) => {
        let oldCategoryId = req.params[0];
        let productCategory = await Dbs.product.getProductByNo(oldCategoryId);
        if (productCategory) {
            res.redirect('/product-catalog/' + productCategory.id);
        }
    });