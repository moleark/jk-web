import fetch from "node-fetch";

export interface userRegisted {
    name: string;
    nick: string;
    icon: string;
    mobile: string;
    email: string;
    pwd: string;
}

/**
 * 根据注册user的id获取其注册信息 
 * @param webUserId 
 * @returns 
 */
export async function getUserRegisted(webUserId: number): Promise<userRegisted> {

    let res = await fetch('https://tv.jkchemical.com/tv/open/user-from-id?id=' + webUserId);
    if (res.ok) {
        let content = await res.json();
        let { ok, res: userInfo } = content;
        if (ok) {
            return userInfo;
        }
    }
}