
export function setPreNextPage(pageIndex: number, pageSize: number, currentPageSize) {
    let prepage: number = pageIndex > 0 ? pageIndex - 1 : -1;
    let nextpage: number = 0;
    if (currentPageSize > pageSize) {
        nextpage = pageIndex + 1;
    }
    return { prepage, nextpage };
}