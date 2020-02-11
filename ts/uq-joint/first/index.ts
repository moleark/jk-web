import config from 'config';
import { settings } from "../settings";
import { Joint, DataPullResult, TestJoint, ProdJoint } from '../uq-joint';
import { pulls, UqOutConverter } from "./pulls";
import { uqOutRead } from "./converter/uqOutRead";
//import { host } from "../uq-joint/tool/host";
//import { centerApi } from "../uq-joint/tool/centerApi";
import { initMssqlPool } from '../mssql/tools';

const maxRows = config.get<number>("firstMaxRows");
const promiseSize = config.get<number>("promiseSize");

(async function () {
    console.log(process.env.NODE_ENV);
    //await host.start();
    //centerApi.initBaseUrl(host.centerUrl);

    await initMssqlPool();

    //let joint = new Joint(settings);
    let joint = new TestJoint(settings);
    //let joint = new ProdJoint(settings);
    console.log('start');
    let start = Date.now();
    let priorEnd = start;
    for (var i = 0; i < pulls.length; i++) {
        let { read, uqIn } = pulls[i];
        let { entity, pullWrite, firstPullWrite } = uqIn;
        console.log(entity + " start at " + new Date());
        let readFunc: UqOutConverter;
        if (typeof (read) === 'string') {
            readFunc = async function (maxId: string): Promise<DataPullResult> {
                return await uqOutRead(read as string, maxId);
            }
        }
        else {
            readFunc = read as UqOutConverter;
        }

        let maxId: string = '', count: number = 0;
        let promises: PromiseLike<any>[] = [];
        for (; ;) {
            let ret: DataPullResult;
            try {
                ret = await readFunc(maxId);
            } catch (error) {
                console.error(error);
                throw error;
            }
            if (ret === undefined || count > maxRows) break;
            let { lastPointer, data: rows } = ret;

            rows.forEach(e => {
                if (firstPullWrite !== undefined) {
                    promises.push(firstPullWrite(joint, e));
                } else if (pullWrite !== undefined) {
                    promises.push(pullWrite(joint, e));
                } else {
                    promises.push(joint.uqIn(uqIn, e));
                }
                count++;
            });
            maxId = lastPointer as string;

            try {
                await pushToTonva(promises, start, priorEnd, count, lastPointer);
            } catch (error) {
                console.error(error);
                if (error.code === "ETIMEDOUT") {
                    await pushToTonva(promises, start, priorEnd, count, lastPointer);
                } else {
                    throw error;
                }
            }
        }
        try {
            await Promise.all(promises);
        } catch (error) {
            // debugger;
            console.error(error);
            throw error;
        }
        promises.splice(0);
        console.log(entity + " end   at " + new Date());
    };
    process.exit();
})();

async function pushToTonva(promises: PromiseLike<any>[], start: number, priorEnd: number, count: number, lastPointer: number | string) {
    if (promises.length >= promiseSize) {
        let before = Date.now();
        await Promise.all(promises);
        promises.splice(0);
        let after = Date.now();
        let sum = Math.round((after - start) / 1000);
        let each = Math.round(after - priorEnd);
        let eachSubmit = Math.round(after - before);
        console.log('count = ' + count + ' each: ' + each + ' sum: ' + sum + ' eachSubmit: ' + eachSubmit + 'ms; lastId: ' + lastPointer);
        priorEnd = after;
    }
}