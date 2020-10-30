"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
var local = process.env.NODE_ENV === 'local';
if (local) {
    console.log('local');
    require('dotenv').config();
}
else {
    console.log('prod');
}
exports.log = function (msg) {
    process.env.NODE_ENV ? console.log(msg) : null;
};
var defaultConfig = {
    prefix: local ? "*" : "¬",
    dbName: "pomodorosDb",
    pomodorosCollectionName: "pomodoros",
    usersColletionName: "users",
    guildsCollectionName: "guilds",
    pomodoro: {
        intervalMs: 30 * 1000,
        restMin: 5,
        workMin: 25,
        longRestMin: 15,
        pomodorosUntilLongRest: 4
    },
    local: local,
    botToken: local ?
        process.env.BOTTOKENTEST :
        process.env.BOTTOKEN
};
exports.default = defaultConfig;
