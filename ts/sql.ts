const db = 'webbuilder$test';

export const sql = {
    homePostList: `
    SELECT a.id, a.caption, a.discription as disp, c.path as image, a.$update as date
        FROM ${db}.tv_post a 
            left join ${db}.tv_template b on a.template=b.id 
            left join ${db}.tv_image c on a.image=c.id
        ORDER BY a.id desc
        LIMIT 10;
    `,

    postFromId: `
    SELECT a.content
        FROM ${db}.tv_post a
        WHERE a.id= ? ;
    `,
};
//c=测试