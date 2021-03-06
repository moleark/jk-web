"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readQueueOutP = {
    name: 'read_queue_out_p',
    params: [
        "_moniker varchar(200)",
    ],
    label: '_exit',
    code: `
    select a.queue_out as queue
        from queue_p a join moniker b on a.moniker=b.id
        where b.moniker=_moniker;
`
};
const readQueueInP = {
    name: 'read_queue_in_p',
    params: [
        "_moniker varchar(200)",
    ],
    label: '_exit',
    code: `
    select a.queue_in as queue
        from queue_p a join moniker b on a.moniker=b.id
        where b.moniker=_moniker;
`
};
/*
const readQueue:Procedure = {
    name: 'read_queue',
    params: [
        "_inOut tinyint",
        "_moniker varchar(200)",
        "_queue bigint",
    ],
    label: '_exit',
    code:
`
    if _inOut=1 then
        select a.id as \`queue\`, b.moniker, a.body as \`data\`
            from queue_in a join moniker b on a.moniker=b.id
            where b.moniker=_moniker and a.id>_queue
            limit 1;
    else
        select a.id as \`queue\`, b.moniker, a.body as \`data\`
        from queue_out a join moniker b on a.moniker=b.id
        where b.moniker=_moniker and a.id>_queue
        limit 1;
    end if;
`
}
*/
const writeQueueIn = {
    name: 'write_queue_in',
    params: [
        "_moniker varchar(200)",
        "_body text"
    ],
    label: '_exit',
    code: `
    declare _monikerId int;
    select a.id into _monikerId from moniker as a where a.moniker=_moniker;
    if _monikerId is null then
        insert into moniker (moniker) values (_moniker);
        set _monikerId=last_insert_id();
    end if;
    insert into queue_in (moniker, body) values (_monikerId, _body);
`
};
const writeQueueOut = {
    name: 'write_queue_out',
    params: [
        "_moniker varchar(200)",
        "_queue bigint",
        "_body text"
    ],
    label: '_exit',
    code: `
    declare _monikerId int;
    select a.id into _monikerId from moniker as a where a.moniker=_moniker;
    if _monikerId is null then
        insert into moniker (moniker) values (_moniker);
        set _monikerId=last_insert_id();
    end if;
    insert into queue_out (moniker, body) values (_monikerId, _body);
    insert into queue_p (moniker, queue_out)
        values (_monikerId, _queue)
        on duplicate key update queue_out=_queue;
`
};
const readQueueIn = {
    name: 'read_queue_in',
    params: [
        "_moniker varchar(200)",
    ],
    label: '_exit',
    code: `
    declare _monikerId int;
    declare _queue bigint;
    select id into _monikerId from moniker where moniker=_moniker;
    if _monikerId is null then
        leave _exit;
    end if;

    select queue_in into _queue from queue_p where moniker=_monikerId;
    if _queue is null then
        set _queue=0;
    end if;

    select a.id, a.body, a.date
        from queue_in a
        where a.moniker=_monikerId
            and a.id>_queue
        limit 1;
`
};
const readQueueOut = {
    name: 'read_queue_out',
    params: [
        "_moniker varchar(200)",
        "_queue bigint"
    ],
    label: '_exit',
    code: `
    declare _monikerId int;
    select id into _monikerId from moniker where moniker=_moniker;
    if _monikerId is null then
        leave _exit;
    end if;

    if _queue is null then
        set _queue=0;
    end if;

    select a.id, a.body, a.date
        from queue_out a
        where a.moniker=_monikerId
            and a.id>_queue
        limit 1;
`
};
const writeQueueInP = {
    name: 'write_queue_in_p',
    params: [
        "_moniker varchar(200)",
        "_queue BIGINT",
    ],
    label: '_exit',
    code: `
    declare _monikerId int;
    select a.id into _monikerId from moniker as a where a.moniker=_moniker;
    if _monikerId is null then
        insert into moniker (moniker) values (_moniker);
        set _monikerId=last_insert_id();
    end if;
    insert into queue_p (moniker, queue_in)
        values (_monikerId, _queue)
        on duplicate key update queue_in=_queue;
`
};
const writeQueueOutP = {
    name: 'write_queue_out_p',
    params: [
        "_moniker varchar(200)",
        "_queue BIGINT",
    ],
    label: '_exit',
    code: `
    declare _monikerId int;
    select a.id into _monikerId from moniker as a where a.moniker=_moniker;
    if _monikerId is null then
        insert into moniker (moniker) values (_moniker);
        set _monikerId=last_insert_id();
    end if;
    insert into queue_p (moniker, queue_out)
        values (_monikerId, _queue)
        on duplicate key update queue_out=_queue;
`
};
exports.default = [
    readQueueOutP, readQueueInP,
    //readQueue, 
    writeQueueIn, writeQueueOut,
    readQueueIn, readQueueOut,
    writeQueueInP, writeQueueOutP
];
//# sourceMappingURL=queue.js.map