//import * as cors from 'cors';
import * as config from 'config';
import * as bodyParser from 'body-parser';
import * as ejs from 'ejs';
import * as path from 'path';
import { Request, Response, NextFunction, Application } from 'express';
import * as express from 'express';
import { homeRouter } from './pages';
import { easyTime } from './tools';

(async function () {

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

    app.use(async (req:express.Request, res:express.Response, next:express.NextFunction) => {
        //let json = res.json;
        let s= req.socket;
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
    
    //挂载静态资源处理中间件,设置css或者js引用文件的静态路径
    //app.use(express.static(__dirname + "/public"));

    // 或者以下这个也可以
    let p = path.join(__dirname, '../public');
    app.use((express.static as any)(p, {maxAge: 36000}));
    app.use('/jk-web', (express.static as any)(p, {maxAge: 36000}));
    //设置模板视图的目录
    app.set("views", "./public/views");
    //设置是否启用视图编译缓存，启用将加快服务器执行效率
    app.set("view cache", true);
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

    app.get('/', (req, res) => res.send('Hello World!'));
    app.get('/jk-web/hello', (req, res) => res.send('Hello World!'));
    app.use((req: Request, res: Response, next: NextFunction) => {
        next();
    });

    //buildRouter(app, pages);
    app.use('/', homeRouter);
    app.use('/jk-web', homeRouter);
    //app.get('/wayne-ligsh-text', wayneLigshTest);
    //app.get('/jk-web/wayne-ligsh-text', wayneLigshTest);

    // 监听服务
    let port = config.get<number>('port');

    app.listen(port, '0.0.0.0', async () => {
        console.log('J&K website on port ' + port);
    });
})();
