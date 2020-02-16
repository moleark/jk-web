const _hm_funcs = {
	__append: function(err:any, cmd:any, style?:any, cell?:any, data?:any) {
		console.log(cmd, style, cell, data);
	},
	"-": "hr"
};

export function hm(text:string):void {
	let textLen = text.length;
	let p = 0; 
	let line = 1, pos = 1;
	let data:any, cmd:any, templet:any, cell:any;
	for (;p<textLen;) {
		let c = text.charAt(p);
		if (c === '#') {
			++p;
			parseElement();
			if (!cmd) cmd = 'raw';
			else if (cmd === '-') cmd = 'hr';
			data = parseData();
		}
		else {
			data = parseData();
			if (data === undefined) continue;
			cmd = 'raw';
		}

		let func = _hm_funcs[cmd];
        if (func === undefined) {
			let tf = eval('typeof ' + cmd);
			if (tf !== 'function') {
				_hm_funcs.__append(`<div class="text-danger">错误：${line}行${pos}位，${cmd}指令不存在</div>`, cmd, templet, cell, data);
				continue;
			}
			else {
				func = eval(cmd);
			}
        }
        func(templet, data, cell);
	}
	return;

	function parseElement():any {
		let pLn = text.indexOf('\n', p);
		if (pLn < 0) pLn = textLen;
		let parts = text.substring(p, pLn).split(/[\s|\t]+/);
		let partsLen = parts.length;
		let i = 0;
		while (i<partsLen) {
			cmd = parts[i++];
			if (cmd) break;
		}
		templet = undefined;
		while (i<partsLen) {
			templet = parts[i++];
			if (templet) {
				templet = templet.trim();
				break;
			}
		}
		cell = undefined;
		while (i<partsLen) {
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

	function parseData():any {
		let ret:any[][] = [];
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
			ret.push(text.substring(p, pLn).split('\t',));
			++line;
			p = pLn + 1;
		}
		if (ret.length === 0) return;

		let rLen = ret.length;
		// 判断next行是不是item的直接子行
		function isChild(item: any[], level:number):boolean {
			let len = item.length;
			if (level >= len-1) return false;
			for (let i=0; i<=level; i++) {
				if (item[i].trim().length > 0) return false;
			}
			return true;
		}
		let iItem:number = 0;
		function build(item:any, level:number):any[] {
			let isFirst = true;
			for (;iItem < rLen;) {
				let next = ret[iItem];
				if (isChild(next, level) === false) break;
				next.splice(0, level+1);
				++iItem;
				next = build(next, level+1);
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
		let tr:any[][] = [];
		while (iItem<rLen) {
			let item = ret[iItem++]
			item = build(item, 0);
			tr.push(item);
		}
		return tr;
	}
}
