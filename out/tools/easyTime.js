"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function easyTime(vDate, withTime) {
    if (!vDate)
        return null;
    let date;
    switch (typeof vDate) {
        default:
            date = vDate;
            break;
        case 'string':
            date = new Date(vDate);
            break;
        case 'number':
            date = new Date(vDate * 1000);
            break;
    }
    let now = new Date();
    let tick, nDate, _date, month, year, hm, nowYear;
    let d = date;
    tick = now.getTime() - d.getTime();
    let hour = d.getHours(), minute = d.getMinutes();
    nDate = now.getDate();
    _date = d.getDate();
    month = d.getMonth() + 1;
    year = d.getFullYear();
    nowYear = now.getFullYear();
    hm = withTime === true ? ' ' + hour + ((minute < 10 ? ':0' : ':') + minute) : '';
    if (tick < -24 * 3600 * 1000) {
        if (year === nowYear)
            return month + '月' + _date + '日' + hm;
        else
            return year + '年' + month + '月' + _date + '日' + hm;
    }
    if (tick < 24 * 3600 * 1000) {
        return _date !== nDate ?
            (tick < 0 ? '明天 ' : '昨天 ') + hm
            : withTime === true ? hm : '今天';
    }
    if (year === nowYear) {
        return month + '月' + _date + '日';
    }
    return year + '年' + month + '月' + _date + '日';
}
exports.easyTime = easyTime;
//# sourceMappingURL=easyTime.js.map