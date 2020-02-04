import { Request, Response } from "express";
import { categories } from "../data";
import { ejsError } from "../tools";

export async function category(req: Request, res:Response) {
    let current = req.params.current;
    let data = {
        title: categories[current].caption,
        current: current,
        categories: categories,
    };
    res.render('category.ejs', data, (err, html) => {
        if (ejsError(err, res) === true) return;
        res.end(html);
    });
};
