"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _hm_funcs = {
    __append: function (err, cmd, style, cell, data) {
        console.log(cmd, style, cell, data);
    },
};
function hm(text) {
    let textLen = text.length;
    let p = 0;
    let line = 1, pos = 1;
    let data, cmd, style, cell;
    for (; p < textLen;) {
        let c = text.charAt(p);
        if (c === '#') {
            ++p;
            parseElement();
            if (!cmd)
                cmd = 'text';
            data = parseData();
        }
        else {
            data = parseData();
            if (data === undefined)
                continue;
            cmd = 'text';
        }
        let func = _hm_funcs[cmd];
        if (func === undefined) {
            _hm_funcs.__append(`<div class="text-danger">错误：${line}行${pos}位，${cmd}指令不存在</div>`, cmd, style, cell, data);
            continue;
        }
        func(style, data, cell);
    }
    return;
    function parseElement() {
        let pLn = text.indexOf('\n', p);
        if (pLn < 0)
            pLn = textLen;
        let parts = text.substring(p, pLn).split(/( )+|\t/);
        let partsLen = parts.length;
        let i = 0;
        while (i < partsLen) {
            cmd = parts[i++];
            if (cmd)
                break;
        }
        style = undefined;
        while (i < partsLen) {
            style = parts[i++];
            if (style) {
                style = style.trim();
                break;
            }
        }
        cell = undefined;
        while (i < partsLen) {
            cell = parts[i++];
            if (cell) {
                cell = cell.trim();
                break;
            }
        }
        ++line;
        pos = 2;
        p = pLn + 1;
    }
    function parseData() {
        let ret = [];
        for (;;) {
            let pLn = text.indexOf('\n', p);
            if (pLn < 0) {
                ret.push([text.substr(p)]);
                ++p;
                break;
            }
            if (pLn === p) {
                ++line;
                pos = 1;
                ++p;
                break;
            }
            ret.push(text.substring(p, pLn).split('\t'));
            ++line;
            p = pLn + 1;
        }
        if (ret.length === 0)
            return;
        let rLen = ret.length;
        // 判断next行是不是item的直接子行
        function isChild(item, level) {
            let len = item.length;
            if (level >= len - 1)
                return false;
            for (let i = 0; i <= level; i++) {
                if (item[i].trim().length > 0)
                    return false;
            }
            return true;
        }
        let iItem = 0;
        function build(item, level) {
            let isFirst = true;
            for (; iItem < rLen;) {
                let next = ret[iItem];
                if (isChild(next, level) === false)
                    break;
                next.splice(0, level + 1);
                ++iItem;
                next = build(next, level + 1);
                if (isFirst === true) {
                    item = [item, [next]];
                    isFirst = false;
                }
                else if (item !== undefined) {
                    item[1].push(next);
                }
            }
            return item;
        }
        let tr = [];
        while (iItem < rLen) {
            let item = ret[iItem++];
            item = build(item, 0);
            tr.push(item);
        }
        return tr;
    }
}
exports.hm = hm;
//# sourceMappingURL=hm.js.map