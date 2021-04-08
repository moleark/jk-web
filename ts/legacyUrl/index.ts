import { Router, Request, Response, NextFunction } from 'express';
import { replace } from 'lodash';
import { Dbs } from '../db';

export const legacyRouter = Router({ mergeParams: true });
legacyRouter.get(/^\/(CH|en)\/products\/(.+?)\.html$/i, async (req: Request, res: Response, next: NextFunction) => {
    let oldProductId = req.params[1];
    let product = await Dbs.product.getProductByNo(oldProductId);
    if (product) {
        res.redirect('/product/' + product.id);
    } else {
        res.status(404);
        next();
    }
});

legacyRouter.get(/^\/(CH|en)\/products\/search\/(fulltextsearch|cas|mdl|originalid|description|mf|productname|chemid|methodtype|advancedSearch)\/(.+?)\.html$/i, async (req: Request, res: Response) => {
    // legacyRouter.get(/^\/(CH|en)\/products\/search\/fulltextsearch\/(.+)\.html$/i, async (req: Request, res: Response) => {
    res.redirect("/search/" + req.params[2]);
});

legacyRouter.get([/^\/(zh\-cn|en-us)\/product-catalog\/parent\/(\d+)\.html$/i,
    /^\/(zh\-cn|en-us)\/product-catalog\/(\d+)(\/\d+\/\d+)?.html$/i,
    /^\/(CH|en)\/products\/search\/productcategory\/(\d+)(\/\d+)?.html$/i],
    async (req: Request, res: Response, next: NextFunction) => {
        let oldCategoryId = req.params[1];
        let productCategory = await Dbs.product.getCategoryByNo(oldCategoryId);
        if (productCategory) {
            res.redirect('/product-catalog/' + productCategory.id);
        } else {
            res.status(404);
            next();
        }
    });

/**
 * 待完善 
 */
legacyRouter.get([/^\/ProductResources.aspx$/i], async (req: Request, res: Response) => {
    res.redirect('/product/mscu/msds');
    /*
    let { query } = req;
    if (!query) {
        res.redirect('/product/mscu/msds');
        return;
    }

    let { langugage, originalId, type } = query;
    switch (type) {
        case 'coa':
            break;
        case 'msds':
            break;
        case "spec":
            break;
        case "usermanu":
            break;
        default:
            break;
    }
    */
});

legacyRouter.get([/^\/(en\-US|zh\-CN)\/product-catalog.html$/i], async (req: Request, res: Response) => {
    let querystring = '';
    let { originalUrl } = req;
    let pos = originalUrl.indexOf('?');
    if (pos > 0) {
        querystring = originalUrl.substring(pos);
    }
    res.redirect("/product-catalog" + querystring);
});

legacyRouter.get([/^\/informationContent.aspx$/i, /^\/news.aspx/i], async (req: Request, res: Response) => {
    res.redirect("/information");
});

legacyRouter.get(/^\/brand.aspx$/i, async (req: Request, res: Response) => {
    res.redirect("/ch/recommended-brand");
});

legacyRouter.get(/^\/contactUs.aspx$/i, async (req: Request, res: Response) => {
    res.redirect("/ch/contact");
});

legacyRouter.get(/^\/job.aspx$/i, async (req: Request, res: Response) => {
    res.redirect("/job");
});

legacyRouter.get(/^\/chemical.aspx$/i, async (req: Request, res: Response) => {
    res.redirect("/product-catalog/47");
});

legacyRouter.get(/^\/Sisanaly.aspx$/i, async (req: Request, res: Response) => {
    res.redirect("/product-catalog/470");
});

legacyRouter.get(/^\/LifeScience.aspx$/i, async (req: Request, res: Response) => {
    res.redirect("/product-catalog/1013");
});

legacyRouter.get(/^\/MaterialScience.aspx$/i, async (req: Request, res: Response) => {
    res.redirect("/product-catalog/1219");
});

legacyRouter.get(/^\/InstrumentConsumables.aspx$/i, async (req: Request, res: Response) => {
    res.redirect("/product-catalog/1545");
});