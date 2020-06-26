import { Db } from "./db";

export class DbContent extends Db {
    private sqlHomePostList: string;
    private sqlPostFromId: string;
    private sqlMorePostPage: string;
    private sqlAllPosts: string;
    private sqlCategoryPost: string;
    private sqlCategoryPostExplain: string;
    private sqlSubjectById: string;
    private sqlSubjectPost: string;
    private sqlRouter: string;
    private sqlPagebranch: string;
    private sqlSubject: string;
    private sqlHotPost: string;

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

        this.sqlCategoryPostExplain = `
            SELECT a.post, a.productcategory
            FROM    ${db}.tv_postproductcatalogexplain a 
                    join ${db}.tv_postpublish cp on a.post = cp.post
            WHERE  a.productcategory=? and cp.openweb = 1;
        `;

        this.sqlCategoryPost = `
            SELECT p.id, p.caption, p.discription as disp, c.path as image,
                    p.$update as date, d.hits, d.sumHits
            FROM    ${db}.tv_postproductcatalog a 
                    join ${db}.tv_post p on a.post = p.id   
                    join ${db}.tv_postpublish cp on p.id = cp.post
                    left join ${db}.tv_image c on p.image=c.id
                    left join ${db}.tv_hot d on p.id=d.post
            WHERE  a.productcategory=? and cp.openweb = 1; 
        `;

        this.sqlSubjectById = `
            SELECT a.id, a.name, a.parent  
            FROM    ${db}.tv_subject a 
            WHERE  a.id=?; 
        `;

        this.sqlSubjectPost = `
            SELECT c.id, c.caption, c.discription as disp, d.path as image,
                    b.update as date, e.hits, e.sumHits
            FROM    ${db}.tv_postsubject a 
                    join ${db}.tv_postpublish b on a.post = b.post        
                    join ${db}.tv_post c on c.id = a.post
                    left join ${db}.tv_image d on c.image=d.id
                    left join ${db}.tv_hot e on a.post=e.post
            WHERE  a.subject = ? and b.openweb = 1
            ORDER BY b.update desc
            LIMIT ?,?;
        `;

        this.sqlRouter = `
            SELECT a.name
            FROM ${db}.tv_webpage a
            WHERE a.name is not null;
        `;

        this.sqlPagebranch = `
            SELECT  a.name, c.content, b.sort
            FROM    ${db}.tv_webpage a
                    JOIN ${db}.tv_webpagebranch as b on a.id = b.webpage
                    JOIN ${db}.tv_branch AS c ON c.id= b.branch
            WHERE   a.name = ?
            ORDER BY b.sort;
        `;

        this.sqlSubject = `
            SELECT 	*
            FROM    ${db}.tv_subject AS a
            WHERE 	parent = 0 
        `;

        this.sqlHotPost = `
            SELECT	distinct a.hits, a.post, b.caption, b.discription, im.path as image, b.author, IFNULL(e.name, d.name) as subject
            FROM 	${db}.tv_hot as a
                    JOIN ${db}.tv_postpublish as p on p.post = a.post and p.openweb = 1
                    JOIN ${db}.tv_post as b on a.post = b.id
                    JOIN ${db}.tv_postsubject AS c ON a.post = c.post
                    JOIN ${db}.tv_subject AS d ON c.subject = d.id
                    LEFT JOIN ${db}.tv_subject AS e ON d.parent = e.id
                    LEFT JOIN ${db}.tv_image im on b.image=im.id
            WHERE 	a.post > 0
            ORDER BY a.hits DESC
            LIMIT 100
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

    async morePostPage(pageStart: number, pageSize: number): Promise<any> {
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

    async categoryPostExplain(id: any): Promise<any> {
        const ret = await this.tableFromSql(this.sqlCategoryPostExplain, [id]);
        return ret;
    }

    async subjectByid(id: any): Promise<any> {
        const ret = await this.tableFromSql(this.sqlSubjectById, [id]);
        if (ret && ret.length > 0)
            return ret[0];
        return { name: "" };
    }

    async subjectPost(id: any, pageStart: number, pageSize: number): Promise<any> {
        const ret = await this.tableFromSql(this.sqlSubjectPost, [id, pageStart, pageSize]);
        return ret;
    }

    async getRoute(): Promise<any> {
        const ret = await this.tableFromSql(this.sqlRouter);
        return ret;
    }

    async getPage(name: string): Promise<any> {
        const ret = await this.tableFromSql(this.sqlPagebranch, [name]);
        return ret;
    }

    async getSubject(): Promise<any> {
        const ret = await this.tableFromSql(this.sqlSubject);
        return ret;
    }


    async getHotPost(): Promise<any> {
        const ret = await this.tableFromSql(this.sqlHotPost);
        return ret;
    }



}
