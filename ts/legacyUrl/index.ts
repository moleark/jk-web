import { Router, Request, Response, NextFunction } from 'express';
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
    /^\/(zh\-cn|en-us)\/product-catalog\/(\d+)(\/\d+\/\d+)?\.html$/i,
    /^\/(CH|en)\/products\/search\/productcategory\/(\d+)(\/\d+)?\.html$/i],
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

//  
legacyRouter.get(/^(\/(CH|EN))?\/index(\.(aspx|html|asp))?$/i, async (req: Request, res: Response, next: NextFunction) => {
    res.redirect('/');
})

/**
 * 待完善 
 */
legacyRouter.get([/^\/ProductResources\.aspx$/i], async (req: Request, res: Response) => {
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

legacyRouter.get([/^\/(en\-US|zh\-CN)\/product-catalog\.html$/i], async (req: Request, res: Response) => {
    let querystring = '';
    let { originalUrl } = req;
    let pos = originalUrl.indexOf('?');
    if (pos > 0) {
        querystring = originalUrl.substring(pos);
    }
    res.redirect("/product-catalog" + querystring);
});

// 原有的各种产品索引界面暂时处理为导航到“产品目录首页”
legacyRouter.get([/^\/(EN|CH)\/products\/index\/(cas|functional_group|productname|elements|methodtype).{0,30}\.html$/i,
    /^\/(EN|CH)\/products\/(jkchemical|Category|Compound|methodtype).{0,30}\.html/i], async (req: Request, res: Response) => {
        res.redirect("/product-catalog");
    });

legacyRouter.get([/^\/Company-inf\.aspx$/i, /^\/company-core\.aspx/i, /^\/jk\.aspx/i, /^\/aboutus\.aspx/i], async (req: Request, res: Response) => {
    res.redirect("/ch/about");
});

legacyRouter.get([/^\/vip\.aspx/i], async (req: Request, res: Response) => {
    res.redirect("/ch/promise");
});

legacyRouter.get([/^\/informationContent\.aspx$/i, /^\/news\.aspx/i, /^\/information\.aspx/i], async (req: Request, res: Response) => {
    res.redirect("/information");
});

legacyRouter.get([/^\/brand\.aspx$/i, /^\/AccuStandard\.aspx/i, /^\/stremchemicals\.aspx/i, /^\/KeyOrganics\.aspx/i,
    /^\/synthesis\.aspx/i],
    async (req: Request, res: Response) => {
        res.redirect("/ch/recommended-brand");
    });

legacyRouter.get(/^\/contactUs\.aspx$/i, async (req: Request, res: Response) => {
    res.redirect("/ch/contact");
});

legacyRouter.get([/^\/job\.aspx$/i, /^\/careers\.aspx$/i], async (req: Request, res: Response) => {
    res.redirect("/job");
});

legacyRouter.get(/^\/chemical\.aspx$/i, async (req: Request, res: Response) => {
    res.redirect("/product-catalog/47");
});

legacyRouter.get(/^\/Sisanaly\.aspx$/i, async (req: Request, res: Response) => {
    res.redirect("/product-catalog/470");
});

legacyRouter.get(/^\/LifeScience\.aspx$/i, async (req: Request, res: Response) => {
    res.redirect("/product-catalog/1013");
});

legacyRouter.get(/^\/MaterialScience\.aspx$/i, async (req: Request, res: Response) => {
    res.redirect("/product-catalog/1219");
});

legacyRouter.get(/^\/InstrumentConsumables\.aspx$/i, async (req: Request, res: Response) => {
    res.redirect("/product-catalog/1545");
});

// 原网站菜单“会员服务”菜单
legacyRouter.get(/^\/Member\/Share\/Shopping\.aspx$/i, async (req: Request, res: Response) => {
    res.redirect("/cart");
});

legacyRouter.get(/^\/Member\/Center\/SaleOrderList\.aspx$/i, async (req: Request, res: Response) => {
    res.redirect("/myOrders");
});

legacyRouter.get(/^\/login\.aspx$/i, async (req: Request, res: Response) => {
    res.redirect("/login");
});