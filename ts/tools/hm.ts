const _hm_funcs = {
	__append: function(err:any, cmd:any, style?:any, cell?:any, data?:any) {
		console.log(cmd, style, cell, data);
	},
	"-": "hr",
	"t0": function(params:any, data:any[]) {
		esc(data);
	},
	"esc": esc,
	collapse: collapse,
};

let state = {
	secId: 1,
	cont: 0,	
}

function next() {
	++state.secId;
	if (state.cont > 0) state.cont--;
}

function collapse() {
	if (state.cont <= 0) return '';
	return 'collapse';
}

function trans(text:string) {
	let len = text.length;
	switch (text.charAt(1)) {
		default:
			let p = text.indexOf('|');
			if (p>0) {
				return `<a href="${text.substring(p+1,len-1)}">${text.substring(1,p)}</a>`;
			}
			return `<b class="text-danger">${text.substring(1, len-1)}</b>`;
		case '_':
			return `<u>${text.substring(2, len-1)}</u>`
		case '-':
			return `<del>${text.substring(2, len-1)}</del>`
		case '*':
			return `<strong>${text.substring(2, len-1)}</strong>`;
		case '[':
			return text.substring(1);
	}
}

function escString(text:string) {
	return text.replace(/\[[^\]]+\]/g, trans);
}

function esc(text:string|any[]) {
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

function dumpHex(text:string) {
	let len = text.length;
	let ret = '';
	for (let i=0; i<8; i++) {
		for (let j=0; j<16; j++) {
			ret += text.charCodeAt(i*16+j).toString(16);
			ret += j===7? '-' : ' ';
		}
		ret += '\r\n';
	}
	return ret;
}

export function hm(text:string):void {
	// /[\n|\r|\n\r|\r\n]/g.e
	let lines = text.match(/[\n|\r|\n\r|\r\n]/g);
	let textLen = text.length;
	let p = 0; 
	let line = 1, pos = 1;
	let data:any, cmd:any, params:string[];
	for (;p<textLen;) {
		let c = text.charAt(p);
		if (c === '#') {
			++p;
			parseElement();
			switch (cmd) {
				default:
					if (!cmd) cmd = 'raw';
					break;
				case '-': cmd = 'hr'; break;
				case '{': cmd = 'box'; break;
				case '}': cmd = 'box'; break;
			}
			data = parseData();
		}
		else {
			cmd = 'raw';
			data = parseData();
			if (data === undefined) continue;
		}

		let func = _hm_funcs[cmd];
        if (func === undefined) {
			let tf = eval('typeof ' + cmd);
			if (tf !== 'function') {
				_hm_funcs.__append(`<div class="text-danger">错误：${line}行${pos}位，${cmd}指令不存在</div>`, cmd, params, data);
				continue;
			}
			else {
				func = eval(cmd);
			}
		}
		func(params, data);
		next();
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
		params = [];
		for (;i<partsLen; i++) {
			let v = parts[i].trim();
			if (!v) continue;
			params.push(v);
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

		if (['grid', 'ol', 'ul', 'olol', 'ulul', 'olul', 'ulol'].indexOf(cmd) < 0) return ret;

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
