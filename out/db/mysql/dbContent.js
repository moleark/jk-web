"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbContent = void 0;
const db_1 = require("./db");
class DbContent extends db_1.Db {
    constructor() {
        super('content');
        let db = this.databaseName;
        let test = this.istest ? "$test" : "";
        this.sqlHomePostList = `
            SELECT  a.id, a.caption, a.discription as disp, c.path as image,
                    cp.update as date, d.hits, d.sumHits
            FROM    ${db}.tv_postpublish cp 
                    join ${db}.tv_post a on cp.post=a.id
                    -- ${db}.tv_post a 
                    left join ${db}.tv_template b on a.template=b.id 
                    left join ${db}.tv_image c on a.image=c.id
                    left join ${db}.tv_hot d on a.id=d.post
            WHERE   a.businessscope = 1 and cp.openweb = 1
            ORDER BY a.id desc
            LIMIT 10;
        `;
        this.sqlPostFromId = `
            SELECT a.content, a.caption, 
                    case  
                        when datediff( NOW(), $UPDATE ) > 1 then DATE_FORMAT( $update ,'%Y-%m-%d')
                    else  DATE_FORMAT( $update, "%H:%i") end as $update
            FROM ${db}.tv_post a
            WHERE a.id= ? ;
        `;
        this.sqlInformationPage = `
            SELECT a.id, a.caption, a.discription as disp, c.path as image, cp.update as date, f.name
            FROM    ${db}.tv_postpublish cp 
                    join ${db}.tv_post a on cp.post=a.id
                    JOIN (
                        SELECT	*
                        FROM 		${db}.tv_postsubject AS aa 
                        WHERE		aa.subject in ( SELECT MAX(subject) FROM ${db}.tv_postsubject AS bb WHERE aa.post = bb.post )
                    )  AS e ON cp.post = e.post
                    JOIN ${db}.tv_subject AS f ON e.subject = f.id
                    left join ${db}.tv_image c on a.image=c.id
            WHERE   a.businessscope = 1 and cp.openweb = 1
            ORDER BY a.id desc
            LIMIT ?,?;
        `;
        this.sqlInformationPost = `
            SELECT 	a.id, a.caption, a.discription as disp, c.path as image, cp.update as date, f.name
            FROM   	${db}.tv_postpublish cp 
                    JOIN ${db}.tv_informationpost AS ip ON ip.post = cp.post
                    JOIN ${db}.tv_post a on cp.post=a.id
                    LEFT JOIN (
                        SELECT	*
                        FROM 		${db}.tv_postsubject AS aa 
                        WHERE		aa.subject in ( SELECT MAX(subject) FROM ${db}.tv_postsubject AS bb WHERE aa.post = bb.post )
                    )  AS e ON cp.post = e.post
                    LEFT JOIN ${db}.tv_subject AS f ON e.subject = f.id
                    LEFT JOIN ${db}.tv_image c on a.image=c.id
            where   a.businessscope = 1
            ORDER BY ip.sort;
        `;
        this.sqlAllPosts = `
            SELECT  a.id, a.caption, a.discription as disp, c.path as image,
                    a.$update as date, d.hits, d.sumHits
            FROM    -- ${db}.tv_customerpost cp join ${db}.tv_post a on cp.post=a.id
                    ${db}.tv_post a 
                    left join ${db}.tv_template b on a.template=b.id 
                    left join ${db}.tv_image c on a.image=c.id
                    left join ${db}.tv_hot d on a.id=d.post
            where   a.businessscope = 1
            ORDER BY a.id desc;
            -- LIMIT 10;
        `;
        this.sqlCategoryInstruction = `
            SELECT a.post, a.productcategory
            FROM    ${db}.tv_postproductcatalogexplain a 
                    join ${db}.tv_postpublish cp on a.post = cp.post
            WHERE  a.productcategory=? and cp.openweb = 1;
        `;
        this.sqlCategoryPost = `
            SELECT  p.id, p.caption, p.discription as disp, c.path as image,
                    p.$update as date, d.hits, d.sumHits
            FROM    ${db}.tv_postproductcatalog a 
                    join ${db}.tv_post p on a.post = p.id   
                    join ${db}.tv_postpublish cp on p.id = cp.post
                    left join ${db}.tv_image c on p.image=c.id
                    left join ${db}.tv_hot d on p.id=d.post
            WHERE   p.businessscope = 1 and a.productcategory=? and cp.openweb = 1; 
        `;
        this.sqlSubjectById = `
            SELECT a.id, a.name, a.parent  
            FROM    ${db}.tv_subject a 
            WHERE  a.id=?; 
        `;
        this.sqlSubjectPost = `
            SELECT  c.id, c.caption, c.discription as disp, d.path as image, b.update as date, e.name
            FROM    ${db}.tv_postsubject a 
                    join ${db}.tv_postpublish b on a.post = b.post        
                    join ${db}.tv_post c on c.id = a.post
                    LEFT JOIN ${db}.tv_image d on c.image=d.id
                    LEFT JOIN ${db}.tv_subject AS e ON a.subject = e.id
            WHERE  a.subject = ? and b.openweb = 1
            ORDER BY b.update desc
            LIMIT ?,?;
        `;
        this.sqlSubject = `
            SELECT 	a.*
            FROM    ${db}.tv_subject AS a
                    join ${db}.tv_subjectdefault as b on a.id = b.subject and b.businessscope = 1
        `;
        this.sqlPostSubject = `
            SELECT 	b.id, b.name
            FROM    ${db}.tv_postsubject as a
                    join ${db}.tv_subject AS b on a.subject = b.id
            WHERE   a.post=?
        `;
        this.sqlRouter = `
            SELECT a.url
            FROM ${db}.tv_postpage a
            WHERE a.url is not null;
        `;
        this.sqlPagePost = `
            select  post, url 
            from    ${db}.tv_postpage
            where   url = ?
        `;
        this.sqlProductApplicationPost = `
            select  product, post 
            from    ${db}.tv_productdescriptionpost
            where   product = ? 
        `;
        /*
        this.sqlPagePost = `
            SELECT  a.name, c.content, b.sort
            FROM    ${db}.tv_webpage a
                    JOIN ${db}.tv_webpagebranch as b on a.id = b.webpage
                    JOIN ${db}.tv_branch AS c ON c.id= b.branch
            WHERE   a.name = ?
            ORDER BY b.sort;
        `;
        */
        this.sqlHotPost = `
            SELECT	distinct a.hits, a.post, b.caption, b.discription, im.path as image, b.author, IFNULL(e.name, d.name) as subject
            FROM 	${db}.tv_hot as a
                    JOIN ${db}.tv_postpublish as p on p.post = a.post and p.openweb = 1
                    JOIN ${db}.tv_post as b on a.post = b.id
                    JOIN (
                        SELECT	*
                        FROM    ${db}.tv_postsubject AS aa 
                        WHERE	aa.subject in ( SELECT MAX(subject) FROM ${db}.tv_postsubject AS bb WHERE aa.post = bb.post )
                    )  AS c ON a.post = c.post
                    JOIN ${db}.tv_subject AS d ON c.subject = d.id
                    LEFT JOIN ${db}.tv_subject AS e ON d.parent = e.id
                    LEFT JOIN ${db}.tv_image im on b.image=im.id
            WHERE 	a.post > 0
            ORDER BY a.hits DESC
            LIMIT 100
        `;
        this.sqlDiscountsPost = `	  
            SELECT  b.id, b.caption, im.path as image
            FROM 	(
                    SELECT  DISTINCT 1 AS posttype, c.post
                    FROM    ${db}.tv_postdomain AS a
                            INNER JOIN ${db}.tv_postdomain AS b ON a.domain = b.domain
                            INNER JOIN ${db}.tv_postsubject AS c ON c.post = b.post AND  c.subject = 18
                    WHERE 	a.post = ?
                    UNION
                    SELECT  DISTINCT 1, c.post
                    FROM    ${db}.tv_postproductcatalog AS a
                            INNER JOIN  ${db}.tv_postproductcatalog AS b ON a.productcategory = b.productcategory
                            INNER JOIN  ${db}.tv_postsubject AS c ON c.post = b.post AND  c.subject = 18
                    WHERE 	a.post = ?
                    UNION
                    SELECT  DISTINCT 2, post
                    FROM    ${db}.tv_postsubject 
                    WHERE   subject = 18
                            AND post NOT IN(
                                SELECT  DISTINCT c.post
                                FROM 	${db}.tv_postdomain AS a
                                        INNER JOIN   ${db}.tv_postdomain AS b ON a.domain = b.domain
                                        INNER JOIN   ${db}.tv_postsubject AS c ON c.post = b.post AND  c.subject = 18
                                WHERE 	a.post = ?
                                UNION
                                SELECT  DISTINCT c.post
                                FROM    ${db}.tv_postproductcatalog AS a
                                        INNER JOIN  ${db}.tv_postproductcatalog AS b ON a.productcategory = b.productcategory
                                        INNER JOIN  ${db}.tv_postsubject AS c ON c.post = b.post AND  c.subject = 18
                                WHERE 	a.post = ?
                            )
                    ) AS a
                    INNER JOIN  ${db}.tv_post AS b ON a.post = b.id
                    INNER JOIN  ${db}.tv_postpublish AS c ON c.post = a.post
                    LEFT  JOIN  ${db}.tv_image im on b.image=im.id
            WHERE   c.openweb = 1	
                    and (
                        (c.startdate IS NULL AND c.enddate IS NULL) or
                        (c.startdate > NOW() AND c.enddate < NOW())
                    )
            ORDER BY a.posttype, c.update desc;
        `;
        this.sqlCorrelation = `
            SELECT  	b.id, b.caption, im.path as image, IFNULL(e.name, d.name) as subject
            FROM 		(
                        SELECT	DISTINCT 1 AS posttype, b.post
                        FROM    ${db}.tv_postproductcatalog AS a
                                INNER JOIN  ${db}.tv_postproductcatalog AS b ON  a.productcategory = b.productcategory
                        WHERE 	a.post = ? or '0' = ?
                        UNION
                        SELECT	DISTINCT 1, b.post
                        FROM    ${db}.tv_postdomain AS a
                                INNER JOIN  ${db}.tv_postdomain AS b ON a.domain = b.domain
                        WHERE 	a.post = ? or '0' = ? limit 5
                        ) AS a
                        INNER JOIN  ${db}.tv_post AS b ON a.post = b.id
                        INNER JOIN  ${db}.tv_postpublish AS pb ON pb.post = a.post
                        JOIN (
                            SELECT	*
                            FROM    ${db}.tv_postsubject AS aa 
                            WHERE	aa.subject in ( SELECT MAX(subject) FROM ${db}.tv_postsubject AS bb WHERE aa.post = bb.post )
                        )  AS c ON a.post = c.post
                        JOIN ${db}.tv_subject AS d ON c.subject = d.id
                        LEFT JOIN ${db}.tv_subject AS e ON d.parent = e.id
                        LEFT  JOIN  ${db}.tv_image im on b.image=im.id
            WHERE  	    pb.openweb = 1 and (
                            (pb.startdate IS NULL AND pb.enddate IS NULL) or
                            (pb.startdate > NOW() AND pb.enddate < NOW())
                        )
            ORDER BY a.posttype, pb.update desc ;
            `;
        this.sqlSlideshow = `
            SELECT  a.description, a.caption, b.path, a.src
            FROM 	${db}.tv_slideshow AS a
                    INNER JOIN ${db}.tv_image AS b ON a.image = b.id 
            WHERE 	a.types = 1 AND b.isvalid = 1
            `;
        this.sqlPostProduct = `
            SELECT  p.id, p.NO, p.brand, p.origin, p.description, p.descriptionc, p.imageurl, pc.chemical
                    , pc.cas, pc.purity, pc.molecularfomula, pc.molecularweight, b.name as brandname
            FROM     ${db}.tv_postproduct AS a
                    INNER JOIN product${test}.tv_productx AS p on p.id = a.product
                    INNER JOIN product${test}.tv_brand AS b ON p.$unit = b.$unit and p.brand = b.id
                    INNER JOIN product${test}.tv_productchemical AS pc on p.$unit = pc.$unit and p.id = pc.product
            WHERE 	a.post =?;
            `;
        this.sqlGetRecommendProducts = `call ${db}.tv_SearchRecommendProduct(24,47,?)`;
    }
    homePostList() {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.tableFromSql(this.sqlHomePostList);
            return ret;
        });
    }
    postFromId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.tableFromSql(this.sqlPostFromId, [id]);
            return ret;
        });
    }
    informationPage(pageStart, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.tableFromSql(this.sqlInformationPage, [pageStart, pageSize]);
            return ret;
        });
    }
    informationPost() {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.tableFromSql(this.sqlInformationPost);
            return ret;
        });
    }
    allPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.tableFromSql(this.sqlAllPosts);
            return ret;
        });
    }
    categoryPost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.tableFromSql(this.sqlCategoryPost, [id]);
            return ret;
        });
    }
    /**
     * 获取目录节点的instruction
     * @param productCategoryId
     */
    getCategoryInstruction(productCategoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.tableFromSql(this.sqlCategoryInstruction, [productCategoryId]);
            return ret;
        });
    }
    subjectByid(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.tableFromSql(this.sqlSubjectById, [id]);
            if (ret && ret.length > 0)
                return ret[0];
            return { name: "" };
        });
    }
    /**
     * 分页获取某栏目（subjectid）中的贴文
     * @param id 栏目id
     * @param pageStart
     * @param pageSize
     * @returns
     */
    subjectPost(id, pageStart, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.tableFromSql(this.sqlSubjectPost, [id, pageStart, pageSize]);
            return ret;
        });
    }
    postSubject(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.tableFromSql(this.sqlPostSubject, [id]);
            return ret;
        });
    }
    /**
     * 获取所有栏目
     * @returns
     */
    getAllSubjects() {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.tableFromSql(this.sqlSubject);
            return ret;
        });
    }
    /**
     * 获取有特定url贴文的url(要配置到路由中)
     * @returns
     */
    getRoute() {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.tableFromSql(this.sqlRouter);
            return ret;
        });
    }
    /**
     *
     * @param url
     * @returns
     */
    getPage(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.tableFromSql(this.sqlPagePost, [url]);
            return ret;
        });
    }
    /**
     * 获取热点贴文
     * @returns
     */
    getHotPost() {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.tableFromSql(this.sqlHotPost);
            return ret;
        });
    }
    getDiscountsPost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.tableFromSql(this.sqlDiscountsPost, [id, id, id, id]);
            return ret;
        });
    }
    getCorrelationPost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.tableFromSql(this.sqlCorrelation, [id, id, id, id]);
            return ret;
        });
    }
    getSlideshow() {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.tableFromSql(this.sqlSlideshow);
            return ret;
        });
    }
    /**
     * 获取贴文后的附加产品(人工附加)
     * @param id
     * @returns
     */
    getPostProduct(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.tableFromSql(this.sqlPostProduct, [id]);
            return ret;
        });
    }
    /**
     * 获取与贴文相关的系统推荐产品
     * @param id
     */
    getRecommendProducts(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.tableFromSql(this.sqlGetRecommendProducts, [id]);
            return ret;
        });
    }
    /**
     * 获取贴文（内容为“产品应用”）
     * @param productId
     * @returns
     */
    getProductApplication(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.tableFromSql(this.sqlProductApplicationPost, [productId]);
            return ret;
        });
    }
    /**
     * 修改贴文内容（用于替换内容中的url)
     * @param id
     * @param content
     */
    replaceContentUrl(id, content) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.execSql(`update ${this.databaseName}.tv_post set content = ? where id = ?`, [content, id]);
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
}
exports.DbContent = DbContent;
//# sourceMappingURL=dbContent.js.map