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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMessage = void 0;
var config_1 = __importDefault(require("../../config"));
var pomodoro_1 = require("../functions/pomodoro");
// readFile('./audio/valendo.mp3', (err , data) => {
//     console.log(err);
//     console.log(data);
// })
var prefix = config_1.default.prefix;
var intervalMs = config_1.default.pomodoro.intervalMs;
var timeOutDict = {};
var pomodoroCicleDict = {};
var guildsPomdoros = {};
var playSound = function (message) { return __awaiter(void 0, void 0, void 0, function () {
    var connection_1, dispatcher, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, message.member.voice.channel.join()];
            case 1:
                connection_1 = _a.sent();
                dispatcher = connection_1.play('./audio/valendo.mp3', {
                    volume: 0.1
                });
                dispatcher.on('start', function () {
                    console.log('audio.mp3 is now playing!');
                });
                dispatcher.on('finish', function () {
                    console.log('audio.mp3 has finished playing!');
                    connection_1.disconnect();
                });
                // Always remember to handle errors appropriately!
                dispatcher.on('error', console.error);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error(error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.handleMessage = function (message) {
    // console.log(message.guild.id);
    // console.log(message.channel);
    if (!message.content.startsWith(prefix) || message.author.bot)
        return;
    var args = message.content.slice(prefix.length).trim().split(/ +/);
    var command = args.shift().toLowerCase();
    // Voice only works in guilds, if the message does not come from a guild,
    // we ignore it
    if (!message.guild)
        return;
    switch (command) {
        case 'start':
            var ms = args.length >= 1 && !isNaN(parseInt(args[0])) ? parseInt(args[0]) * 60 * 1000 : 25 * 60 * 1000;
            // impedir num muito grandes
            // playSound(message);
            var timer_1 = 0;
            var timerMsg_1 = message.channel.send(pomodoro_1.secondsToTimerStr(timer_1));
            var interval_1 = setInterval(function () {
                timer_1 += Math.floor(intervalMs / 1000);
                timerMsg_1.then(function (sentMsg) {
                    sentMsg.edit(pomodoro_1.secondsToTimerStr(timer_1));
                }).catch();
            }, intervalMs);
            var timeOut = setTimeout(function () {
                message.channel.send('fim do pomodoro');
                timeOutDict[message.guild.id] = undefined;
                clearInterval(interval_1);
            }, ms);
            timeOutDict[message.guild.id] = timeOut;
            break;
        case 'cancelar':
            if (timeOutDict[message.guild.id] !== undefined) {
                clearTimeout(timeOutDict[message.guild.id]);
                message.channel.send('pomodoro cancelado');
                timeOutDict[message.guild.id] = undefined;
            }
            else {
            }
            break;
        case 'continue':
            break;
        case 'log':
            console.log(timeOutDict);
            break;
        default:
            break;
    }
};
