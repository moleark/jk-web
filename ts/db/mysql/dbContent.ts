import { Db } from "./db";

export class DbContent extends Db {
    private sqlHomePostList: string;
    private sqlPostFromId: string;
    private sqlMorePostPage: string;
    private sqlAllPosts: string;
    private sqlCategoryPost: string;

    constructor() {
        super('content');
        let db = this.databaseName;
        this.sqlHomePostList = `
            SELECT a.id, a.caption, a.discription as disp, c.path as image,
                cp.update as date, d.hits, d.sumHits
            FROM ${db}.tv_postpublish cp 
                join ${db}.tv_post a on cp.post=a.id
                -- ${db}.tv_post a 
                left join ${db}.tv_template b on a.template=b.id 
                left join ${db}.tv_image c on a.image=c.id
                left join ${db}.tv_hot d on a.id=d.post
            WHERE cp.openweb = 1
            ORDER BY a.id desc
            LIMIT 10;
        `;

        this.sqlPostFromId = `
            SELECT a.content, a.caption
                FROM ${db}.tv_post a
                WHERE a.id= ? ;
        `;

        this.sqlMorePostPage = `
            SELECT a.id, a.caption, a.discription as disp, c.path as image,
                    cp.update as date, d.hits, d.sumHits
            FROM ${db}.tv_postpublish cp 
                join ${db}.tv_post a on cp.post=a.id
                -- ${db}.tv_post a 
                left join ${db}.tv_template b on a.template=b.id 
                left join ${db}.tv_image c on a.image=c.id
                left join ${db}.tv_hot d on a.id=d.post
            WHERE cp.openweb = 1
            ORDER BY a.id desc
            LIMIT ?,?;
        `;

        this.sqlAllPosts = `
            SELECT a.id, a.caption, a.discription as disp, c.path as image,
                a.$update as date, d.hits, d.sumHits
            FROM -- ${db}.tv_customerpost cp join ${db}.tv_post a on cp.post=a.id
                ${db}.tv_post a 
                left join ${db}.tv_template b on a.template=b.id 
                left join ${db}.tv_image c on a.image=c.id
                left join ${db}.tv_hot d on a.id=d.post
            ORDER BY a.id desc;
            -- LIMIT 10;
        `;

        this.sqlCategoryPost = `
            SELECT a.post, a.productcategory
            FROM ${db}.tv_postproductcatalogexplain a 
            WHERE  a.productcategory=?; 
    `;

    }

    async homePostList(): Promise<any> {
        const ret = await this.tableFromSql(this.sqlHomePostList);
        return ret;
    }

    async postFromId(id: any): Promise<any> {
        const ret = await this.tableFromSql(this.sqlPostFromId, [id]);
        return ret;
    }

    async morePostPage(pageStart: number, pageSize): Promise<any> {
        const ret = await this.tableFromSql(this.sqlMorePostPage, [pageStart, pageSize]);
        return ret;
    }

    async allPosts(): Promise<any> {
        const ret = await this.tableFromSql(this.sqlAllPosts);
        return ret;
    }

    async categoryPost(id: any): Promise<any> {
        const ret = await this.tableFromSql(this.sqlCategoryPost, [id]);
        return ret;
    }

}
