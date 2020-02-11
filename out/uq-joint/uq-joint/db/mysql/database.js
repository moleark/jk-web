"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("config");
exports.databaseName = config_1.default.get("database");
exports.existsDatabase = 'SELECT SCHEMA_NAME as sname \
    FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = \''
    + exports.databaseName + '\'';
exports.createDatabase = 'CREATE DATABASE IF NOT EXISTS `'
    + exports.databaseName
    + '` default CHARACTER SET utf8 COLLATE utf8_unicode_ci;';
exports.useDatabase = 'USE `' + exports.databaseName + '`;';
function alterTableIncrement(tbl, inc) {
    return `ALTER TABLE \`${exports.databaseName}\`.\`${tbl}\` auto_increment=${inc}`;
}
exports.alterTableIncrement = alterTableIncrement;
//# sourceMappingURL=database.js.map