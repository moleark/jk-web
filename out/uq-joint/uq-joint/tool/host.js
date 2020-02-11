"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
const config_1 = require("config");
exports.isDevelopment = process.env.NODE_ENV === 'development';
function tryConfig(name) {
    if (config_1.default.has(name) === false)
        return;
    return config_1.default.get(name);
}
const centerHost = tryConfig('centerhost');
const centerDebugHost = 'localhost:3000'; //'192.168.86.64';
//const resHost = process.env['REACT_APP_RES_HOST'] || centerHost;
const resDebugHost = 'localhost:3015'; //'192.168.86.63';
const uqDebugHost = 'localhost:3015'; //'192.168.86.63';
const uqDebugBuilderHost = 'localhost:3009';
const hosts = {
    centerhost: {
        value: tryConfig('debug-center-host') || centerDebugHost,
        local: false
    },
    reshost: {
        value: tryConfig('debug-res-host') || resDebugHost,
        local: false
    },
    uqhost: {
        value: tryConfig('debug-uq-host') || uqDebugHost,
        local: false
    },
    unitxhost: {
        value: tryConfig('debug-unitx-host') || uqDebugHost,
        local: false
    },
    "uq-build": {
        value: tryConfig('debug-uq-build-host') || uqDebugBuilderHost,
        local: false
    }
};
function centerUrlFromHost(host) {
    if (host.startsWith('https://') === true) {
        if (host.endsWith('/'))
            return host;
        return host + '/';
    }
    return `http://${host}/`;
}
function centerWsFromHost(host) {
    let https = 'https://';
    if (host.startsWith(https) === true) {
        host = host.substr(https.length);
        if (host.endsWith('/') === true)
            host = host.substr(0, host.length - 1);
        return 'wss://' + host + '/tv/';
    }
    return `ws://${host}/tv/`;
}
const fetchOptions = {
    method: "GET",
    mode: "no-cors",
    headers: {
        "Content-Type": "text/plain"
    },
};
class Host {
    start(testing) {
        return __awaiter(this, void 0, void 0, function* () {
            this.testing = testing;
            if (exports.isDevelopment === true) {
                yield this.tryLocal();
            }
            let host = this.getCenterHost();
            this.centerUrl = centerUrlFromHost(host);
            this.ws = centerWsFromHost(host);
            this.resHost = this.getResHost();
        });
    }
    debugHostUrl(host) { return `http://${host}/hello`; }
    tryLocal() {
        return __awaiter(this, void 0, void 0, function* () {
            let promises = [];
            let hostArr = [];
            for (let i in hosts) {
                let hostValue = hosts[i];
                let { value } = hostValue;
                if (hostArr.findIndex(v => v === value) < 0)
                    hostArr.push(value);
            }
            for (let host of hostArr) {
                let fetchUrl = this.debugHostUrl(host);
                promises.push(localCheck(fetchUrl));
            }
            let results = yield Promise.all(promises);
            let len = hostArr.length;
            for (let i = 0; i < len; i++) {
                let local = results[i];
                let host = hostArr[i];
                for (let j in hosts) {
                    let hostValue = hosts[j];
                    if (hostValue.value === host) {
                        hostValue.local = local;
                    }
                }
            }
            /*
            let p = 0;
            for (let i in hosts) {
                let hostValue = hosts[i];
                hostValue.local = results[p];
                ++p;
            }
            */
        });
    }
    getCenterHost() {
        let { value, local } = hosts.centerhost;
        if (exports.isDevelopment === true) {
            if (local === true)
                return value;
        }
        return centerHost;
    }
    getResHost() {
        let { value, local } = hosts.reshost;
        if (exports.isDevelopment === true) {
            if (local === true)
                return value;
        }
        return this.resHost;
    }
    getUrlOrDebug(url, debugHost = 'uqhost') {
        if (exports.isDevelopment === false)
            return url;
        let host = hosts[debugHost];
        if (host === undefined)
            return url;
        let { value, local } = host;
        if (local === false)
            return url;
        return `http://${value}/`;
    }
    getUrlOrTest(db, url, urlTest) {
        let path;
        if (this.testing === true) {
            if (urlTest !== '-')
                url = urlTest;
            path = 'uq/test/' + db + '/';
        }
        else {
            path = 'uq/prod/' + db + '/';
        }
        url = this.getUrlOrDebug(url);
        return url + path;
    }
    localCheck(urlDebug) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield localCheck(urlDebug);
        });
    }
}
exports.host = new Host();
// 因为测试的都是局域网服务器，甚至本机服务器，所以一秒足够了
// 网上找了上面的fetch timeout代码。
// 尽管timeout了，fetch仍然继续，没有cancel
// 实际上，一秒钟不够。web服务器会自动停。重启的时候，可能会比较长时间。也许两秒甚至更多。
//const timeout = 2000;
const timeout = 200;
function fetchLocalCheck(url) {
    return new Promise((resolve, reject) => {
        node_fetch_1.default(url, fetchOptions)
            .then(v => {
            v.text().then(resolve).catch(reject);
        })
            .catch(reject);
        const e = new Error("Connection timed out");
        setTimeout(reject, timeout, e);
    });
}
function localCheck(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fetchLocalCheck(url);
            return true;
        }
        catch (err) {
            return false;
        }
    });
}
//# sourceMappingURL=host.js.map