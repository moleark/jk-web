export function csv(text:string):string[][] {
    if (typeof csv !== 'string') return text as any;
    let ret:string[][] = [];
    if (!text) return ret;
    let lines = text.split('\n');
    for (let line of lines) {
        let rArr = line.split('\t');
        if (rArr.length === 1) {
            let c0 = rArr[0].trim();
            if (c0.length === 0) continue;
            rArr[0] = c0;
        }
        ret.push(rArr);
    }
    return ret;
}
