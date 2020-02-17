export function hmToEjs(hm:string):string {
	let ln: string, lnln: string;
	let lnPos = hm.indexOf('\r\n');
	ln = (lnPos < 0)? '\n' : '\r\n';
	lnln = ln + ln;
	let lnlnLen = lnln.length;

	let defs = '';
	let text = '';
	let len = hm.length;
	let lastP = 0;

	function appendCode(start:number, end?:number) {
		text += hm.substring(start, end);
		text += ';secId++; \n';
	}

	for (let p=0; p<len;) {
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

	return '<% ' + defs + 'hm(\n`' + text + '\n`); %>';
}
