import { Db } from "./db";

export class DbProduct extends Db {
    constructor() {
        super('product');
    }
}
