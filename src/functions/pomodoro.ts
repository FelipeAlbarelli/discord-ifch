import defaultConfig  from '../config';
import {setTimeout as setTimeoutNode} from 'timers';

const {
    intervalMs, longRestMin ,pomodorosUntilLongRest ,restMin ,workMin
} = defaultConfig.pomodoro

export const secondsToTimerStr = (seconds : number) => {
    const minutes = Math.floor(seconds / 60);
    const remainSeconds = seconds - (minutes * 60);
    const minStr = minutes >= 10 ? minutes.toString() : `0${minutes}`;
    const remainSecondsStr = remainSeconds >= 10 ? remainSeconds.toString() : `0${remainSeconds}`
    return minStr + ":" + remainSecondsStr;
}

export class PomodoroMachine {

    c = 0;
    interval?: NodeJS.Timeout;
    timeOut?: NodeJS.Timeout;
    pomodoring?: boolean;
    active = false;

    tick: Function;
    finishPomodoro: Function;
    finishRest: Function;
    finishLongRest: Function;

    constructor(
        tick: Function, 
        finishPomodoro: Function,
        finishRest: Function,
        finishCicle: Function) {
            this.tick = tick;
            this.finishPomodoro = finishPomodoro;
            this.finishRest = finishRest;
            this.finishLongRest = finishCicle;
            console.log('constructing pomdoro machine')
    }

    startRest(ms = restMin * 60 * 1000) {
        let t = 0;
        this.pomodoring = false;
        this.interval = setInterval(() => {
            t += 1;
            this.tick(t * intervalMs);
        }, intervalMs);
        this.timeOut = setTimeoutNode(() => {
            if (this.interval) clearInterval(this.interval);
            if (this.c === pomodorosUntilLongRest) {
                this.c =0;
                this.finishLongRest();
            } else {
                this.finishRest()
                this.start();
            }
        }, ms)
    }

    start( ms = workMin * 60 * 1000  ) {
        console.log('start pomodoro' , ms)
        let t = 0;
        this.pomodoring = true;
        this.interval = setInterval(() => {
            t += 1;
            this.tick(t * intervalMs)
        },
        intervalMs);
        this.active = true;

        this.timeOut = setTimeoutNode(() => {
            this.c += 1;
            if (this.interval) clearInterval(this.interval);
            this.finishPomodoro(this.c);
            if (this.c === pomodorosUntilLongRest) {
                this.startRest(longRestMin * 60 * 1000)
            } else {
                this.startRest()
            }
        }, ms)
    }

    cancelOne() {
        if (this.interval) clearInterval(this.interval);
        if (this.timeOut) clearInterval(this.timeOut);
        this.pomodoring = false;
        this.active = false;
    }


}