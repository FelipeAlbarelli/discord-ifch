"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = {
    prefix: "¬",
    dbName: "pomodorosDb",
    pomodorosCollectionName: "pomodoros",
    usersColletionName: "users",
    guildsCollectionName: "guilds",
    pomodoro: {
        intervalMs: 10 * 1000,
        restMin: .5,
        workMin: .5,
        longRestMin: 15,
        pomodorosUntilLongRest: 2
    }
};
exports.default = config;
