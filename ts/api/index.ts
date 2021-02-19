import { Router } from "express";
import { search } from "./search";
import { epecLogin } from "../epec";

export const apiRouter = Router({ mergeParams: true });
apiRouter.get(['/search/:key', '/search/:key/:pageNumber(\\d+)', '/search/:key?debug'], search);

// 中石化登录地址
apiRouter.get('/epec/login', epecLogin);

// 药物所登录地址
apiRouter.get('/UserIdentify.ashx', epecLogin);