"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __importDefault(require("../../config"));
var pomodoro_1 = require("../functions/pomodoro");
var voice_1 = require("./voice");
// readFile('./audio/valendo.mp3', (err , data) => {
//     console.log(err);
//     console.log(data);
// })
var prefix = config_1.default.prefix;
var guildsPomdoros = {};
var guildsTimersMsgs = {};
// const beginPomodoroSound = async (message: Message) => {
//     try {
//         const connection = await message.member.voice.channel.join();
//         // console.log(connection);
//         const dispatcher = connection.play('./audio/valendo.mp3', {
//             volume: .7
//         });
//         dispatcher.on('start', () => {
//             console.log('audio.mp3 is now playing!');
//         });
//         dispatcher.on('finish', () => {
//             console.log('audio.mp3 has finished playing!');
//             connection.disconnect();
//         });
//         // Always remember to handle errors appropriately!
//         dispatcher.on('error', console.error);
//     } catch (error) {
//         console.error(error);
//     }
// }
exports.handleMessage = function (message) {
    console.log("recivied msg " + message.content);
    if (!message.content.startsWith(prefix) || message.author.bot)
        return;
    var args = message.content.slice(prefix.length).trim().split(/ +/);
    var command = args.shift().toLowerCase();
    // console.log(message.guild.id);
    // console.log(message.channel);
    var id = message.guild.id;
    console.log("pomodoroMachine:");
    console.log(guildsPomdoros[id]);
    if (guildsPomdoros[id] === undefined) {
        console.log('creating pomodoro machine');
        guildsPomdoros[id] = new pomodoro_1.PomodoroMachine(function (ms) {
            if (guildsTimersMsgs[id] !== undefined) {
                guildsTimersMsgs[id].edit(pomodoro_1.secondsToTimerStr(ms / 1000));
            }
            ;
            console.log('tick');
        }, function (numPomo) {
            message.channel.send("fim do pomodoro #" + numPomo);
            voice_1.playSound(message, 'parou');
            message.channel.send(pomodoro_1.secondsToTimerStr(0)).then(function (sentMsg) {
                guildsTimersMsgs[id] = sentMsg;
            });
        }, function () {
            voice_1.playSound(message, "valendo");
            message.channel.send('fim da pausa');
            message.channel.send(pomodoro_1.secondsToTimerStr(0)).then(function (sentMsg) {
                guildsTimersMsgs[id] = sentMsg;
            });
        }, function () {
            message.channel.send('fim da pausa longa');
            delete guildsTimersMsgs[id];
            delete guildsPomdoros[id];
        });
    }
    // Voice only works in guilds, if the message does not come from a guild,
    // we ignore it
    if (!message.guild)
        return;
    switch (command) {
        case 'start':
            voice_1.playSound(message, "valendo");
            console.log('start command');
            var ms = args.length >= 1 && !isNaN(parseInt(args[0])) ? parseInt(args[0]) * 60 * 1000 : 25 * 60 * 1000;
            guildsPomdoros[id].start();
            message.channel.send(pomodoro_1.secondsToTimerStr(0)).then(function (sentMsg) {
                guildsTimersMsgs[id] = sentMsg;
            }).catch(function (err) {
                console.log('error sending msg');
                console.error(err);
            });
            // impedir num muito grandes
            // playSound(message);
            // let timer = 0;
            // const timerMsg = message.channel.send(secondsToTimerStr(timer));
            // const interval = setInterval( () => {
            //     timer += Math.floor(intervalMs/1000);
            //     timerMsg.then(sentMsg => {
            //         sentMsg.edit(secondsToTimerStr(timer));
            //     }).catch();
            // },
            // intervalMs)
            // const timeOut = setTimeout( () => {
            //     message.channel.send('fim do pomodoro');
            //     timeOutDict[message.guild.id] = undefined;
            //     clearInterval(interval);
            // }, ms);
            // timeOutDict[message.guild.id] = timeOut;
            break;
        case 'cancelar':
            guildsPomdoros[id].cancelOne();
            break;
        case 'continue':
            break;
        case 'log':
            break;
        default:
            break;
    }
};
