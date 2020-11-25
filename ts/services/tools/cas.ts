
export function isCAS(cas: string) {
    if (!cas)
        return false;

    cas = cas.replace(/-/g, '');
    if (!/\d{5,20}/.test(cas))
        return false;
    let casArr = [...cas];
    let len = casArr.length;
    let sum = casArr.reduce((a, c, i) => {
        return a + parseInt(c) * (len - i - 1);
    }, 0);
    return sum % 10 === parseInt(casArr[len - 1]);
}