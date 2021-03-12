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
const config = require("config");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const express = require("express");
const pages_1 = require("./pages");
const tools_1 = require("./tools");
const db_1 = require("./db");
const page_1 = require("./pages/page");
const session = require("express-session");
const express_session_1 = require("express-session");
const api_1 = require("./api");
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        db_1.Dbs.init();
        // 创建express服务
        let app = express();
        //app.use(useLog());
        app.locals.easyTime = tools_1.easyTime;
        // 全局错误处理handler(文档上说这个要在调用其他的use方法之后调用)
        app.use((err, req, res, next) => {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
        // 使用 body-parser 
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
        app.set('json replacer', (key, value) => {
            if (value === null)
                return undefined;
            return value;
        });
        var sessionCookieOptions = config.get('sessionCookieOptions');
        app.use(session({
            name: sessionCookieOptions.name,
            secret: 'session-cat',
            resave: false,
            saveUninitialized: false,
            unset: 'destroy',
            rolling: true,
            store: new express_session_1.MemoryStore(),
            cookie: sessionCookieOptions
        }));
        app.use((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            //let json = res.json;
            let s = req.socket;
            let p = '';
            if (req.method !== 'GET')
                p = JSON.stringify(req.body);
            console.log('\n=== %s:%s - %s %s %s', s.remoteAddress, s.remotePort, req.method, req.originalUrl, p);
            try {
                yield next();
            }
            catch (e) {
                console.error(e);
            }
        }));
        // 设置所引用的shop的脚本
        app.locals.shopJsPath = config.get('shopJsPath');
        //挂载静态资源处理中间件,设置css或者js引用文件的静态路径
        //app.use(express.static(__dirname + "/public"));
        // 或者以下这个也可以
        let p = path.join(__dirname, '../public');
        app.use(express.static(p, { maxAge: 36000 }));
        app.use('/jk-web', express.static(p, { maxAge: 36000 }));
        // 下面是结合cart运行需要的unit.json文件
        app.get(/unit.json$/, function (req, res) {
            res.sendFile('./public/unit.json');
        });
        //设置模板视图的目录
        app.set("views", "./public/views");
        //设置是否启用视图编译缓存，启用将加快服务器执行效率
        app.set("view cache", false);
        // 2.注册html模板引擎：
        app.engine('html', ejs.renderFile);
        //设置模板引擎的格式即运用何种模板引擎
        app.set("view engine", "html");
        app.all('*', function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
            next();
        });
        app.get('/hello', (req, res) => res.send('Hello World!'));
        app.get('/jk-web/hello', (req, res) => res.send('Hello World!'));
        app.use((req, res, next) => {
            next();
        });
        // 这种动态添加路由的方式需要重启express后才能生效
        let routeArray = yield db_1.Dbs.content.getRoute();
        routeArray.forEach(element => {
            pages_1.homeRouter.get(element.url, page_1.page);
        });
        app.use('/', pages_1.homeRouter);
        app.use('/jk-web', pages_1.homeRouter);
        app.use('/api', api_1.apiRouter);
        app.use('/jk-web/api', api_1.apiRouter);
        //app.get('/wayne-ligsh-text', wayneLigshTest);
        //app.get('/jk-web/wayne-ligsh-text', wayneLigshTest);
        // 监听服务
        let port = config.get('port');
        app.listen(port, '0.0.0.0', () => __awaiter(this, void 0, void 0, function* () {
            console.log('J&K website on port ' + port);
            console.log('env: ' + process.env.NODE_ENV);
        }));
    });
})();
//# sourceMappingURL=index.js.map