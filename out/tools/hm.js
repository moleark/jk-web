"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _hm_funcs = {
    __append: function (err, cmd, style, cell, data) {
        console.log(cmd, style, cell, data);
    },
    "-": "hr",
    "t0": function (params, data) {
        esc(data);
    },
    "esc": esc,
    collapse: collapse,
};
let state = {
    secId: 1,
    cont: 0,
};
function next() {
    ++state.secId;
    if (state.cont > 0)
        state.cont--;
}
function collapse() {
    if (state.cont <= 0)
        return '';
    return 'collapse';
}
function trans(text) {
    let len = text.length;
    switch (text.charAt(1)) {
        default:
            let p = text.indexOf('|');
            if (p > 0) {
                return `<a href="${text.substring(p + 1, len - 1)}">${text.substring(1, p)}</a>`;
            }
            return `<b class="text-danger">${text.substring(1, len - 1)}</b>`;
        case '_':
            return `<u>${text.substring(2, len - 1)}</u>`;
        case '-':
            return `<del>${text.substring(2, len - 1)}</del>`;
        case '*':
            return `<strong>${text.substring(2, len - 1)}</strong>`;
        case '[':
            return text.substring(1);
    }
}
function escString(text) {
    return text.replace(/\[[^\]]+\]/g, trans);
}
function esc(text) {
    switch (typeof text) {
        default:
            return text;
        case 'object':
            return text.map(v => {
                switch (typeof v) {
                    case 'string': return escString(v);
                    case 'undefined': return '';
                    default: return esc(v);
                }
            }).join(' ');
        case 'string':
            return escString(text);
    }
}
function dumpHex(text) {
    let len = text.length;
    let ret = '';
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 16; j++) {
            ret += text.charCodeAt(i * 16 + j).toString(16);
            ret += j === 7 ? '-' : ' ';
        }
        ret += '\r\n';
    }
    return ret;
}
const lineSeperator = /\r\n|\n|\n\r/g;
function hmParse(text) {
    let lines = text.split(lineSeperator);
    let linesLen = lines.length;
    let data, cmd, params;
    let p = 0;
    for (; p < linesLen;) {
        let line = lines[p];
        let c = line.charAt(0);
        if (c === '#') {
            parseElement(line);
            switch (cmd) {
                default:
                    if (!cmd)
                        cmd = 'raw';
                    break;
                case '-':
                    cmd = 'hr';
                    break;
                case '[':
                    cmd = 'box';
                    break;
                case ']':
                    cmd = 'boxEnd';
                    break;
            }
            p++;
            data = parseData();
        }
        else {
            cmd = 'raw';
            data = parseData();
            if (data === undefined)
                continue;
        }
        let func = _hm_funcs[cmd];
        if (func === undefined) {
            if (cmd.charAt(0) === ':') {
                _hm_funcs.__append(`<div class="text-danger">错误：${p}行，${cmd}函数定义</div>`, cmd, params, data);
            }
            else {
                let tf = eval('typeof ' + cmd);
                if (tf !== 'function') {
                    _hm_funcs.__append(`<div class="text-danger">错误：${p}行，${cmd}指令不存在</div>`, cmd, params, data);
                    continue;
                }
                else {
                    func = eval(cmd);
                }
            }
        }
        if (func !== undefined)
            func(params, data);
        next();
    }
    return;
    function parseElement(line) {
        let parts = line.split(/[ |\t]+/);
        let partsLen = parts.length;
        let i = 0;
        while (i < partsLen) {
            cmd = parts[i++];
            if (cmd) {
                cmd = cmd.substr(1);
                break;
            }
        }
        params = [];
        for (; i < partsLen; i++) {
            let v = parts[i].trim();
            if (!v)
                continue;
            params.push(v);
        }
    }
    function parseData() {
        let ret = [];
        for (;;) {
            let line = lines[p++];
            if (line.trim().length === 0) {
                for (; p < linesLen; p++) {
                    line = lines[p];
                    if (line.trim().length !== 0)
                        break;
                }
                break;
            }
            ret.push(line.split('\t'));
        }
        if (ret.length === 0)
            return;
        if (['grid', 'ol', 'ul', 'olol', 'ulul', 'olul', 'ulol'].indexOf(cmd) < 0)
            return ret;
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
exports.hmParse = hmParse;
//# sourceMappingURL=hm.js.map