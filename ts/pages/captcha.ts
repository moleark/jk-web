import { Request, Response } from "express";
export let SessionCaptcha = null;
export async function captcha(req: Request, res: Response) {
    let captchapng = require("captchapng")
    let mynum = Math.ceil(Math.random() * 9000 + 1000);
    req.session.captcha = mynum;
    SessionCaptcha = req.session.captcha;
    // console.log(req.session);

    let p = new captchapng(60, 22, mynum); // width,height,numeric captcha
    p.color(0, 0, 0, 0);  // First color: background (red, green, blue, alpha)
    p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)
    let img = p.getBase64();
    let imgbase64 = Buffer.from(img, 'base64');
    res.writeHead(200, {
        'Content-Type': 'image/png'
    });
    res.end(imgbase64);
};