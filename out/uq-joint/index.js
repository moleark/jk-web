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
const express_1 = require("express");
const bodyParser = require("body-parser");
const cors_1 = require("cors");
const config_1 = require("config");
const uq_joint_1 = require("./uq-joint");
const settings_1 = require("./settings");
//import { host } from './uq-joint/tool/host';
//import { centerApi } from './uq-joint/tool/centerApi';
const tools_1 = require("./mssql/tools");
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(process.env.NODE_ENV);
        //await host.start();
        //centerApi.initBaseUrl(host.centerUrl);
        let connection = config_1.default.get("mysqlConn");
        if (connection === undefined || connection.host === '0.0.0.0') {
            console.log("mysql connection must defined in config/default.json or config/production.json");
            return;
        }
        yield tools_1.initMssqlPool();
        let app = express_1.default();
        app.use((err, req, res, next) => {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
        app.use(bodyParser.json());
        app.use(cors_1.default());
        app.set('json replacer', (key, value) => {
            if (value === null)
                return undefined;
            return value;
        });
        app.use((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let s = req.socket;
            let p = '';
            if (req.method !== 'GET')
                p = JSON.stringify(req.body);
            console.log('%s:%s - %s %s %s', s.remoteAddress, s.remotePort, req.method, req.originalUrl, p);
            try {
                yield next();
            }
            catch (e) {
                console.error(e);
            }
        }));
        //let joint = new Joint(settings);
        let joint = new uq_joint_1.ProdJoint(settings_1.settings);
        //let joint = new TestJoint(settings);
        app.use('/joint-uq-jk', joint.createRouter());
        let port = config_1.default.get('port');
        app.listen(port, () => __awaiter(this, void 0, void 0, function* () {
            console.log('UQ-API listening on port ' + port);
            let { host, user } = connection;
            console.log('process.env.NODE_ENV: %s\nDB host: %s, user: %s', process.env.NODE_ENV, host, user);
            joint.start();
            //await startTimer();
        }));
    });
})();
//# sourceMappingURL=index.js.map