import defaultConfig  from '../config';

const {
    intervalMs, longRestMin ,pomodorosUntilLongRest ,restMin ,workMin
} = defaultConfig.pomodoro
import Timer from 'tiny-timer';

export const secondsToTimerStr = (seconds : number) => {
    const minutes = Math.floor(seconds / 60);
    const remainSeconds = seconds - (minutes * 60);
    const minStr = minutes >= 10 ? minutes.toString() : `0${minutes}`;
    const remainSecondsStr = remainSeconds >= 10 ? remainSeconds.toString() : `0${remainSeconds}`
    return minStr + ":" + remainSecondsStr;
}

export class PomodoroMachine {

    tickTimer : Timer;

    constructor(
        private functions : {onShortRestStart?: (pomdorosDone: number) => void,
         onConcentrationStart?: (pomdorosDone: number) => void;
         onLongRestStart?: () => void;
         onPomodoroCicleEnd?: () => void;
         onTick?: (minutes: number, pomodoring: boolean, pomodorosDone: number) => void},
        private options? : {
            shortRestTime: number,
            longRestTime: number,
            totalPomodoros: number,
            concentrationTime: number,
        }
    ) {
        this.tickTimer = new Timer({
            interval: .5 * 1000,
            stopwatch: false
        });
        this.tickTimer.on('tick' , (ms) => {
            console.log(ms);
        })
    }

    start = () => {
        console.log('start pomodoro')
        this.tickTimer.start(25000 , 1000);
    }

    pause = () => {
        this.tickTimer.pause();
    }

    resume = () => {
        this.tickTimer.resume();
    }

    status = () => {
        console.log(this.tickTimer.status , this.tickTimer.duration);
    }

}