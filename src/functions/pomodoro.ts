import config  from '../../config';
import {setTimeout as setTimeoutNode} from 'timers';
const intervalMs = config.pomodoro.intervalMs; 

export const secondsToTimerStr = (seconds : number) => {
    const minutes = Math.floor(seconds / 60);
    const remainSeconds = seconds - (minutes * 60);
    const minStr = minutes >= 10 ? minutes.toString() : `0${minutes}`;
    const remainSecondsStr = remainSeconds >= 10 ? remainSeconds.toString() : `0${remainSeconds}`
    return minStr + ":" + remainSecondsStr;
}

export class PomodoroMachine {

    c = 0;
    interval: NodeJS.Timeout;
    timeOut: NodeJS.Timeout;
    pomodoring: boolean;

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
    }

    startRest(ms = 5 * 60 * 1000) {
        let t = 0;
        this.pomodoring = false;
        this.interval = setInterval(() => {
            t += 1;
            this.tick(t * intervalMs);
        }, intervalMs);
        this.timeOut = setTimeoutNode(() => {
            clearInterval(this.interval);
            if (this.c === 4) {
                this.c =0;
                this.finishLongRest();
            } else {
                this.finishRest()
                this.start();
            }
        }, ms)
    }

    start( ms = 25 * 60 * 1000  ) {
        let t = 0;
        this.pomodoring = true;
        this.interval = setInterval(() => {
            t += 1;
            this.tick(t * intervalMs)
        },
        intervalMs);

        this.timeOut = setTimeoutNode(() => {
            this.c += 1;
            clearInterval(this.interval);
            this.finishPomodoro();
            if (this.c === 4) {
                this.startRest(15 * 60 * 1000)
            } else {
                this.startRest()
            }
        }, ms)
    }

    cancelOne() {
        clearInterval(this.interval);
        clearInterval(this.timeOut);
        this.pomodoring = false;
    }

    reset() {

    }


}