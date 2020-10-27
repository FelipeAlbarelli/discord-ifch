"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __importDefault(require("../../config"));
var timers_1 = require("timers");
var _a = config_1.default.pomodoro, intervalMs = _a.intervalMs, longRestMin = _a.longRestMin, pomodorosUntilLongRest = _a.pomodorosUntilLongRest, restMin = _a.restMin, workMin = _a.workMin;
exports.secondsToTimerStr = function (seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainSeconds = seconds - (minutes * 60);
    var minStr = minutes >= 10 ? minutes.toString() : "0" + minutes;
    var remainSecondsStr = remainSeconds >= 10 ? remainSeconds.toString() : "0" + remainSeconds;
    return minStr + ":" + remainSecondsStr;
};
var PomodoroMachine = /** @class */ (function () {
    function PomodoroMachine(tick, finishPomodoro, finishRest, finishCicle) {
        this.c = 0;
        this.tick = tick;
        this.finishPomodoro = finishPomodoro;
        this.finishRest = finishRest;
        this.finishLongRest = finishCicle;
        console.log('constructing pomdoro machine');
    }
    PomodoroMachine.prototype.startRest = function (ms) {
        var _this = this;
        if (ms === void 0) { ms = restMin * 60 * 1000; }
        var t = 0;
        this.pomodoring = false;
        this.interval = setInterval(function () {
            t += 1;
            _this.tick(t * intervalMs);
        }, intervalMs);
        this.timeOut = timers_1.setTimeout(function () {
            clearInterval(_this.interval);
            if (_this.c === pomodorosUntilLongRest) {
                _this.c = 0;
                _this.finishLongRest();
            }
            else {
                _this.finishRest();
                _this.start();
            }
        }, ms);
    };
    PomodoroMachine.prototype.start = function (ms) {
        var _this = this;
        if (ms === void 0) { ms = workMin * 60 * 1000; }
        console.log('start pomodoro', ms);
        var t = 0;
        this.pomodoring = true;
        this.interval = setInterval(function () {
            t += 1;
            _this.tick(t * intervalMs);
        }, intervalMs);
        this.timeOut = timers_1.setTimeout(function () {
            _this.c += 1;
            clearInterval(_this.interval);
            _this.finishPomodoro(_this.c);
            if (_this.c === pomodorosUntilLongRest) {
                _this.startRest(longRestMin * 60 * 1000);
            }
            else {
                _this.startRest();
            }
        }, ms);
    };
    PomodoroMachine.prototype.cancelOne = function () {
        clearInterval(this.interval);
        clearInterval(this.timeOut);
        this.pomodoring = false;
    };
    PomodoroMachine.prototype.reset = function () {
    };
    return PomodoroMachine;
}());
exports.PomodoroMachine = PomodoroMachine;
