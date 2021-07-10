import { Message, TextChannel, VoiceChannel } from "discord.js";
import {PomodoroMachine, secondsToTimerStr} from './pomodoroMachine';
import Timer from 'timer.js'
import { playSoundDiscord } from "../discord/voice";

type Status = "pomdoro-on" | "short-rest" | "long-rest" | "inactive" | "pause";

export class PomodoroTextController {

    concentrationTime = 25 * 60;
    shortRest = 5 * 60;
    longRest = 15 * 60;
    sleepTime = 5 * 60;
    totalCicles = 4;
    tickTime = 30;

    private guildsPomdoros : {
        [key: string] : {
            timer : Timer,
            status : Status,
            pomodorosBeggined: number,
            timerMessage: Message,
            totalTicks: number,
        },
    } = {};

    constructor(
    ) {
    }

    private getKey = (textChanel: TextChannel, voiceChanel: VoiceChannel) => {
        return `${textChanel}${voiceChanel}`;
    }

    private createGuild = (textChanel: TextChannel, voiceChanel: VoiceChannel) => {
        try {
            const key = this.getKey(textChanel , voiceChanel);
            this.guildsPomdoros[key] = {
                timer : new Timer({tick: this.tickTime}),
                status : 'inactive',
                pomodorosBeggined: 0,
                timerMessage : null,
                totalTicks: 0
            }
        } catch (err) {
            console.log(err)
        }
    }

    private resetTimer = (textChanel: TextChannel, voiceChanel: VoiceChannel) => {
        const key = this.getKey(textChanel , voiceChanel);
        const guild = this.guildsPomdoros[key];
        guild.timer = new Timer({tick: this.tickTime});
        guild.totalTicks = 0;
    }

    startPomodoro = async (textChanel: TextChannel, voiceChanel: VoiceChannel) => {
        const key = this.getKey(textChanel , voiceChanel);
        if (! this.guildsPomdoros[key] ) {
            this.createGuild(textChanel , voiceChanel);
        }
        const guild = this.guildsPomdoros[key];

        if ( guild.status == 'pomdoro-on' || guild.status == 'pause') {
            return; // já esta havendo pomodoro
        }
        this.resetTimer(textChanel , voiceChanel);

        guild.pomodorosBeggined += 1;
        guild.status = 'pomdoro-on';
        textChanel.send(`Começo do pomodoro #${guild.pomodorosBeggined}`);
        playSoundDiscord(voiceChanel , 'valendo');
        guild.timerMessage = await textChanel.send(secondsToTimerStr(0));
        guild.timer.on('onend' , () => {
            textChanel.send(`fim do pomodoro #${guild.pomodorosBeggined}`);
            guild.timerMessage.delete();
            this.startRest(textChanel , voiceChanel , guild.pomodorosBeggined == this.totalCicles ? 'long' : 'short' ).then( () => {

            } ).catch(err => {

            })
        } )
        guild.timer.on('ontick' , () => {
            guild.totalTicks += 1;
            guild.timerMessage.edit(secondsToTimerStr(guild.totalTicks * this.tickTime)).then(() => {})
        })
        guild.timer.start(this.concentrationTime)
    }

    pause(textChanel: TextChannel, voiceChanel: VoiceChannel){
        const key = this.getKey(textChanel , voiceChanel);
        const guild = this.guildsPomdoros[key];
        const status = guild.status;
        if ( status !== 'pomdoro-on') {
            return;
        }
        guild.status = 'pause';
        guild.timer.pause();
        textChanel.send(`Pomodoro pausado`);
    }

    async resume(textChanel: TextChannel, voiceChanel: VoiceChannel) {
        const key = this.getKey(textChanel , voiceChanel);
        const guild = this.guildsPomdoros[key];
        const status = guild.status;
        if (status !== 'pause') {
            return;
        }
        guild.status = 'pomdoro-on';
        guild.timer.start()
        textChanel.send(`Pomodoro ${guild.pomodorosBeggined} reiniciado`);
        guild.timerMessage = await textChanel.send(secondsToTimerStr(guild.totalTicks * this.tickTime));
    }

    soneca(textChanel: TextChannel, voiceChanel: VoiceChannel) {
        const key = this.getKey(textChanel , voiceChanel);
        if (!this.guildsPomdoros[key]) {
            return;
        }
        const guild = this.guildsPomdoros[key];
        const statusAccept: Status[] = ['short-rest' , 'long-rest'];
        if (!statusAccept.includes(guild.status)) {
            return;
        }
        const remainDuration: number = (guild.timer.getDuration());
        guild.timer.stop();
        console.log(remainDuration , remainDuration / 1000 + this.sleepTime);
        
        guild.timer.start(remainDuration / 1000 + this.sleepTime);
        

    }

    cancel(textChanel: TextChannel, voiceChanel: VoiceChannel) {
        const key = this.getKey(textChanel , voiceChanel);
        if (!this.guildsPomdoros[key]) {
            return;
        }
        if (this.guildsPomdoros[key].status === 'inactive') {
            return;
        }
        textChanel.send(`Pomodoro cancelado`);
        this.guildsPomdoros[key].timer.stop()
        // console.log(this.guildsPomdoros)
        delete this.guildsPomdoros[key];
        // console.log(this.guildsPomdoros)
    }

    private onEndShortRest(textChanel: TextChannel, voiceChanel: VoiceChannel) {
        return;
    }

    private onEndLongRest(textChanel: TextChannel, voiceChanel: VoiceChannel) {
        const key = this.getKey(textChanel , voiceChanel);
        const guild = this.guildsPomdoros[key]; 
        guild.pomodorosBeggined = 0;
        guild.status ='inactive';
        guild.totalTicks = 0;
    }

    private startRest = async ( textChanel: TextChannel, voiceChanel: VoiceChannel , type : 'short' | 'long' ) => {
        const restTypeString = type == 'short' ? 'curta' : 'longa';
        const key = this.getKey(textChanel , voiceChanel);
        const guild = this.guildsPomdoros[key]; 
        this.resetTimer(textChanel , voiceChanel);
        guild.status = type == 'short' ? 'short-rest' : 'long-rest';
        textChanel.send(`Pausa ${restTypeString} ${guild.pomodorosBeggined}`);
        playSoundDiscord(voiceChanel , 'parou');
        guild.timerMessage = await textChanel.send(secondsToTimerStr(0));
        guild.timer.on('onend' , () => {
            guild.timerMessage.delete();
            textChanel.send(`fim da pausa ${restTypeString} #${guild.pomodorosBeggined}`);
            if (type === 'short') {
                this.startPomodoro(textChanel , voiceChanel);
                this.onEndShortRest(textChanel , voiceChanel);
            } else {
                this.onEndLongRest(textChanel , voiceChanel);
            }
        })
        guild.timer.on('ontick' , () => {
            guild.totalTicks += 1;
            guild.timerMessage.edit(secondsToTimerStr(guild.totalTicks * this.tickTime)).then(() => {})
        })
        guild.timer.start(type == 'short' ? this.shortRest : this.longRest);
        
    }


}