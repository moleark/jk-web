import { Mapper } from "./tool/mapper";
import { Joint } from "./joint";
import { UqProp } from "./uq/uq";

export interface DataPullResult { lastPointer: number | string, data: any[] };
export type DataPull<T> = (joint: Joint, uqIn: T, queue: number | string) => Promise<DataPullResult>;
export type PullWrite = (joint: Joint, data: any) => Promise<boolean>;
export type DataPush<T> = (joint: Joint, uqIn: T, queue: number, data: any) => Promise<boolean>;

export interface UqIn {
    uq: string;
    entity: string;
    type: 'tuid' | 'tuid-arr' | 'map';
    /**
     * 配置从源数据到目的数据的转换规则
     */
    mapper: Mapper;
    /**
     * 从（增量）数据源获取数据的函数或SQL语句
     */
    pull?: DataPull<UqIn> | string;

    /**
     * 将增量数据发送到目的服务器的函数
     */
    pullWrite?: PullWrite;
    /**
     * 将初始数据发送到目的服务器的函数
     */
    firstPullWrite?: PullWrite;
    push?: DataPush<UqIn>;
}

export interface UqInTuid extends UqIn {
    type: 'tuid';
    key: string;    // 在源数据中，tuid主键的名称, 用于建立map
    /**
     * 从
     */
    pull?: DataPull<UqInTuid> | string;
    push?: DataPush<UqInTuid>;
}

export interface UqInTuidArr extends UqIn {
    type: 'tuid-arr';
    key: string;
    owner: string;
    pull?: DataPull<UqInTuidArr> | string;
    push?: DataPush<UqInTuidArr>;
}

export interface UqInMap extends UqIn {
    type: 'map';
    pull?: DataPull<UqInMap> | string;
    push?: DataPush<UqInMap>;
}

export interface UqOut {
    uq: string;
    entity: string;
    type: 'tuid' | 'tuid-arr' | 'map';
    mapper: Mapper;
    //push?: DataPush;
}

export interface UqBus {
    /**
     * face的名称
     */
    face: string;
    /**
     *
     */
    mapper: Mapper;
    /**
     * 该函数用户从外部系统读取将要写入bus的数据
     */
    pull?: DataPull<UqBus>;
    /**
     * 该函数用户将bus中的数据写入外部系统
     */
    push?: DataPush<UqBus>;
    uqIdProps?: { [name: string]: UqProp }; //{contact: {tuid: 'contact'}}
}

export interface Settings {
    name: string;
    unit: number;
    allowedIP: string[];
    uqIns: UqIn[];
    uqOuts: UqOut[];
    bus?: UqBus[];
    pullReadFromSql?: (sql: string, queue: number | string) => Promise<DataPullResult>;
}
