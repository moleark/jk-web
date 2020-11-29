import { Router } from "express";
import { search } from "./search";

export const apiRouter = Router({ mergeParams: true });
apiRouter.get(['/search/:key', '/search/:key/:pageStart(\\d+)'], search);