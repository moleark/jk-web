//import * as cors from 'cors';
import * as config from 'config';
import * as bodyParser from 'body-parser';
import * as ejs from 'ejs';
import * as path from 'path';
import { Request, Response, NextFunction, Application } from 'express';
import * as express from 'express';
import { homeRouter } from './pages';
import { easyTime } from './tools';
import { Dbs } from './db';
import { page } from './pages/page';
import * as session from 'express-session';
import { MemoryStore } from 'express-session';
import { apiRouter } from './api';

(async function () {
    Dbs.init();

    // 创建express服务
    let app = express();
    //app.use(useLog());
    app.locals.easyTime = easyTime;

    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });

    // 使用 body-parser 
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    //app.use(cors());
    app.set('json replacer', (key: string, value: any) => {
        if (value === null) return undefined;
        return value;
    });

    app.use(session({
        secret: 'session-cat',//keyboard cat
        name: 'session-cat',
        resave: false,
        saveUninitialized: false,
        unset: 'destroy',
        rolling: true,
        store: new MemoryStore(),
        cookie: {
            maxAge: 60 * 1000 * 30,
            secure: false,
        }
    }));

    app.use(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        //let json = res.json;
        let s = req.socket;
        let p = '';
        if (req.method !== 'GET') p = JSON.stringify(req.body);
        console.log('\n=== %s:%s - %s %s %s', s.remoteAddress, s.remotePort, req.method, req.originalUrl, p);
        try {
            await next();
        }
        catch (e) {
            console.error(e);
        }
    });

    // 设置所引用的shop的脚本
    app.locals.shopJsPath = config.get('shopJsPath');
    //挂载静态资源处理中间件,设置css或者js引用文件的静态路径
    //app.use(express.static(__dirname + "/public"));

    // 或者以下这个也可以
    let p = path.join(__dirname, '../public');
    app.use((express.static as any)(p, { maxAge: 36000 }));
    app.use('/jk-web', (express.static as any)(p, { maxAge: 36000 }));
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
    app.use((req: Request, res: Response, next: NextFunction) => {
        next();
    });

    // 这种动态添加路由的方式需要重启express后才能生效
    let routeArray = await Dbs.content.getRoute();
    routeArray.forEach(element => {
        homeRouter.get(element.url, page);
    });
    app.use('/', homeRouter);
    app.use('/jk-web', homeRouter);
    app.use('/api', apiRouter);
    app.use('/jk-web/api', apiRouter);
    //app.get('/wayne-ligsh-text', wayneLigshTest);
    //app.get('/jk-web/wayne-ligsh-text', wayneLigshTest);

    // 监听服务
    let port = config.get<number>('port');

    app.listen(port, '0.0.0.0', async () => {
        console.log('J&K website on port ' + port);
        console.log('env: ' + process.env.NODE_ENV);
    });
})();
