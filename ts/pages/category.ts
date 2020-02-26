import { Request, Response } from "express";
import { ejsError } from "../tools";
import { buildData } from "../tools";
import { Dbs } from "../db";

export async function category(req: Request, res: Response) {
    let current = req.params.current;
    const categories = await Dbs.product.getRootCategories();
    let categorieschildr: any[];
    for (let i = 0; i < categories.length; i++) {
        let category = categories[i];
        let { id } = category;
        categories[i].children = await Dbs.product.getChildrenCategories(id);
        id = categories[current].id
        categorieschildr = await Dbs.product.getChildrenCategories(id);
    }
    let data = buildData(req, {
        current: current,
        categorieschildr: categorieschildr,
        categories: categories,
    });
    res.render('category.ejs', data, (err, html) => {
        if (ejsError(err, res) === true) return;
        res.end(html);
    });
};
