import { Request } from "express";
import { getRootPath } from "./getRootPath";

export function buildData(req: Request, data:any) {
    if (!data) data = {};
	if (!data.$title) data.$title = '';

	data.$root = getRootPath(req);
    return data;
}
