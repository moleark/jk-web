import { Router } from "express";
import { search } from "./search";
import { epecLogin } from "../epec";

export const apiRouter = Router({ mergeParams: true });
apiRouter.get(['/search/:key', '/search/:key/:pageNumber(\\d+)', '/search/:key?debug'], search);

// 中石化
apiRouter.get('/epec/login', epecLogin);
apiRouter.get('/epec/saveOrder', epecLogin);

// 药物所
apiRouter.get('/UserIdentify.ashx', epecLogin);