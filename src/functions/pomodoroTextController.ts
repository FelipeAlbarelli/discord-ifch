import { Message, TextChannel, VoiceChannel } from "discord.js";
import {PomodoroMachine, secondsToTimerStr} from './pomodoroMachine';
import Timer from 'timer.js'



export class PomodoroTextController {

    concentrationTime = 25;
    shortRest = 5;
    longRest = 15;
    totalCicles = 4;

    private guildsPomdoros : {
        [key: string] : {
            timer : Timer,
            status : "pomdoro-on" | "short-rest" | "long-rest" | "inactive",
            pomodorosDone: number,
            timerMessage: Message
        },
    } = {};

    constructor(
    ) {
    }

    private getKey = (textChanel: TextChannel, voiceChanel: VoiceChannel) => {
        return `${voiceChanel}`;
    }

    private createGuild = (textChanel: TextChannel, voiceChanel: VoiceChannel) => {
        try {
            const key = this.getKey(textChanel , voiceChanel);
            this.guildsPomdoros[key] = {
                timer : new Timer({tick: 30}),
                status : 'inactive',
                pomodorosDone: 0,
                timerMessage : null
            }
        } catch (err) {
            console.log(err)
        }
    }

    startPomodoro = async (textChanel: TextChannel, voiceChanel: VoiceChannel) => {
        const key = this.getKey(textChanel , voiceChanel);
        if (! this.guildsPomdoros[key] ) {
            this.createGuild(textChanel , voiceChanel);
        }
        const guild = this.guildsPomdoros[key];

        if ( guild.status == 'pomdoro-on') {
            return; // já esta havendo pomodoro
        }
        guild.pomodorosDone += 1;
        guild.status = 'pomdoro-on';
        textChanel.send(`Começo do pomodoro #${guild.pomodorosDone}`);
        guild.timerMessage = await textChanel.send(secondsToTimerStr(0));
        guild.timer.on('onend' , () => {
            textChanel.send(`fim do pomodoro #${guild.pomodorosDone}`);
        } )
        guild.timer.on('ontick' , (ms : number) => {
            guild.timerMessage.edit(secondsToTimerStr(ms * 1000)).then(() => {})
        })
        guild.timer.start(5)
    }


}