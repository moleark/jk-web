import { Request, Response } from "express";
import { ejsError } from "../tools";
import { buildData } from "../tools";
import { Dbs } from "../db";

export async function classifyyCatalogSub(req: Request, res: Response) {
    let index = req.params.index;
    let current = req.params.current;
    let idx = req.params.idx;
    let indexes = req.params.indexes;
    const categories = await Dbs.product.getRootCategories();
    let categorieschildr: any[];
    let subdirectory: any[];
    let catalogSub: any[];
    let catalog: any[];
    for (let i = 0; i < categories.length; i++) {
        let category = categories[i];
        let { id } = category;
        categories[i].children = await Dbs.product.getChildrenCategories(id);
        id = categories[current].id;
        categorieschildr = await Dbs.product.getChildrenCategories(id);
    }
    for (let k = 0; k < categorieschildr.length; k++) {
        let { id } = categorieschildr[k];
        categorieschildr[k].children = await Dbs.product.getChildrenCategories(id);
        id = categorieschildr[index].id;
        subdirectory = await Dbs.product.getChildrenCategories(id);
    }
    for (let i = 0; i < subdirectory.length; i++) {
        let { id } = subdirectory[i];
        subdirectory[i].children = await Dbs.product.getChildrenCategories(id);
        id = subdirectory[idx].id;
        catalog = await Dbs.product.getChildrenCategories(id);
    }
    for (let i = 0; i < catalog.length; i++) {
        let { id } = catalog[i];
        catalog[i].children = await Dbs.product.getChildrenCategories(id);
        id = catalog[indexes].id;
        catalogSub = await Dbs.product.getChildrenCategories(id);
    }
    
    let data = buildData(req, {
        title: catalog[indexes].name,
        indexes: indexes,
        // 右边标题目录
        catalog: catalog,
        // 左边一条所有子集
        catalogSub: catalogSub,

    });
    res.render('classifyyCatalogSub.ejs', data, (err, html) => {
        if (ejsError(err, res) === true) return;
        res.end(html);
    });
};