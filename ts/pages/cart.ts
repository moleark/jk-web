import { Request, Response } from "express";
import * as ejs from 'ejs';
import { device, viewPath, ejsSuffix, buildData } from "../tools";

export async function cart(req: Request, res: Response) {

    let header = ejs.fileLoader(viewPath + 'headers/header' + ejsSuffix).toString();
    let homeHeader = ejs.fileLoader(viewPath + 'headers/home-header' + ejsSuffix).toString();
    let homeFooter = ejs.fileLoader(viewPath + 'footers/home-footer' + ejsSuffix).toString();
    let body = ejs.fileLoader(viewPath + 'cart.ejs').toString();

    let template = header + homeHeader
        + '<div class="container my-3">'
        + body
        + '</div>'
        + homeFooter;

    let data = await buildData(req, {});

    let html = ejs.render(template, data);
    res.end(html);
}