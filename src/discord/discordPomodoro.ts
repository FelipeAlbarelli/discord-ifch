import { Message, TextChannel, VoiceChannel } from "discord.js";
import { addPomodoros } from "../db/pomodoros";
import { PomodoroMachine, secondsToTimerStr } from "../functions/pomodoro";
import { playSound } from "./voice";

export const createDiscordPomodoro = ( textChanel: TextChannel ,voiceChanel: VoiceChannel, onEndLongRest?: Function) => {
    let timerMsg;
    textChanel.send(secondsToTimerStr(0)).then( sentMsg => {
        timerMsg = sentMsg;
    });
    playSound(voiceChanel , 'valendo');
    return new PomodoroMachine(
        (ms: number) => {
            timerMsg?.edit(secondsToTimerStr(ms/1000))
        },
        (numPomo: number) => {
            textChanel.send(`fim do pomodoro #${numPomo}`);
            playSound(voiceChanel , 'parou');
            textChanel.send(secondsToTimerStr(0)).then((sentMsg) => {
                timerMsg = sentMsg;
            });
            addPomodoros(voiceChanel).then( () => {
                console.log('pomodoro registrado em fb com sucesso')
            });
        },
        () => {
            playSound(voiceChanel, "valendo");
            textChanel.send('fim da pausa');
            textChanel.send(secondsToTimerStr(0)).then((sentMsg) => {
                timerMsg = sentMsg;
            })
        },
        () => {
            textChanel.send('fim da pausa longa');
            onEndLongRest();
        }
    )
}