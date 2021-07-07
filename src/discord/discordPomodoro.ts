import { Message, TextChannel, VoiceChannel } from "discord.js";
import { addPomodoro } from "../db/pomodoros";
import { PomodoroMachine, secondsToTimerStr } from "../functions/pomodoro";
import { playSound } from "./voice";

// export const createDiscordPomodoro = ( 
//     textChanel: TextChannel ,
//     voiceChanel: VoiceChannel
// ) => {
//     let timerMsg;
//     textChanel.send(secondsToTimerStr(0)).then( sentMsg => {
//         timerMsg = sentMsg;
//     });
//     playSound(voiceChanel , 'valendo');
//     return new PomodoroMachine(
//         (ms: number) => {
//             timerMsg?.edit(secondsToTimerStr(ms/1000))
//         },
//         (numPomo: number) => {
//             textChanel.send(`fim do pomodoro #${numPomo}`);
//             playSound(voiceChanel , 'parou');
//             textChanel.send(secondsToTimerStr(0)).then((sentMsg) => {
//                 timerMsg = sentMsg;
//             });
//             voiceChanel.members.forEach(member => {
//                 addPomodoro(member.id);
//             })
//         },
//         () => {
//             playSound(voiceChanel, "valendo");
//             textChanel.send('fim da pausa');
//             textChanel.send(secondsToTimerStr(0)).then((sentMsg) => {
//                 timerMsg = sentMsg;
//             })
//         },
//         () => {
//             playSound(voiceChanel , 'parou');
//             textChanel.send('fim da pausa longa');
//         }
//     )
// }

