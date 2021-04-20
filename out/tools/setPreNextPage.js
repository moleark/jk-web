"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPreNextPage = void 0;
function setPreNextPage(pageIndex, pageSize, currentPageSize) {
    let prepage = pageIndex > 0 ? pageIndex - 1 : -1;
    let nextpage = 0;
    if (currentPageSize > pageSize) {
        nextpage = pageIndex + 1;
    }
    return { prepage, nextpage };
}
exports.setPreNextPage = setPreNextPage;
//# sourceMappingURL=setPreNextPage.js.map