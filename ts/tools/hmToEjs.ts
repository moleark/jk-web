export function hmToEjs(hm:string):string {
	let ln: string, lnln: string;
	let lnPos = hm.indexOf('\n');
	if (lnPos <= 0) {
		ln = '\n';
	}
	else {
		if (hm.charAt(lnPos-1) === '\r') {
			ln = '\r\n';
		}
		else {
			ln = '\n';
		}
	}	
	lnln = ln + ln;
	let lnLen = ln.length, lnlnLen = lnln.length;

	let defs = '';
	let text = '';
	let len = hm.length;
	let lastP = 0;

	if (hm.substr(1, 2) == 'hm') {
		let p = hm.indexOf(lnln, 3);
		if (p<0) return '';
		p += lnlnLen;
		while (hm.substr(p, lnLen) === ln) p += lnLen;
		if (hm.charAt(p) !== '#') {
			return hm.substr(p);
		}
		lastP = p;
	}

	function appendCode(start:number, end?:number) {
		text += hm.substring(start, end);
	}

	for (let p=lastP; p<len;) {
		let sec:string;
		let pCur = hm.indexOf('#:', p);
		if (pCur < 0) {
			//text += hm.substring(lastP);
			appendCode(lastP);
			break;
		}
		if (pCur==0 || pCur>lnln.length && hm.substr(pCur-lnlnLen, lnlnLen)===lnln) {
			if (pCur > 0) {
				//text += hm.substring(lastP, pCur);
				appendCode(lastP, pCur);
			}

			let lEnd = hm.indexOf(ln, pCur + 2);
			if (lEnd < 0) break;
			let func = hm.substring(pCur+2, lEnd).trim();
			p = lEnd + ln.length;
			let pEnd = hm.indexOf(lnln, p);
			if (pEnd < 0) {
				sec = hm.substr(p);
				p = len;
			}
			else {
				sec = hm.substring(p, pEnd+2);
				p = pEnd + 2;
			}

			defs += 'function ' + func + '(pattern, data){ data=data||[]; %>' + sec + '<%};\n';
			lastP = p;
		}
		else {
			p += 2;
		}
	}

	return '<% ' + defs + 'hmParse(\n`' + text + '\n`); %>';
}
