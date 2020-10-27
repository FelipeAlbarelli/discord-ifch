"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = {
    prefix: "¬",
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
    }
};
exports.default = config;
