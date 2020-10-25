import { Client, Message  } from 'discord.js';
import config  from '../../config'
import { secondsToTimerStr , PomodoroMachine } from '../functions/pomodoro';
import { playSound } from './voice';

// readFile('./audio/valendo.mp3', (err , data) => {
//     console.log(err);
//     console.log(data);
// })

const {prefix} = config;

const guildsPomdoros: { [key: string]: PomodoroMachine;} = {}

const guildsTimersMsgs: {[key: string]: Message;} = {};

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

export const handleMessage = (message: Message) => {

    console.log(`recivied msg ${message.content}`);

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // console.log(message.guild.id);
    // console.log(message.channel);
    const id = message.guild.id;
    console.log(`pomodoroMachine:`);
    console.log(guildsPomdoros[id]);



    if (guildsPomdoros[id] === undefined) {
        console.log('creating pomodoro machine')
        guildsPomdoros[id] = new PomodoroMachine(
            (ms: number) => {
                if (guildsTimersMsgs[id] !== undefined) {
                    guildsTimersMsgs[id].edit(secondsToTimerStr(ms/1000))
                };
                console.log('tick');
            },
            (numPomo: number) => {
                message.channel.send(`fim do pomodoro #${numPomo}`);
                playSound(message , 'parou');
                message.channel.send(secondsToTimerStr(0)).then((sentMsg) => {
                    guildsTimersMsgs[id] = sentMsg;
                })
            },
            () => {
                playSound(message, "valendo");
                message.channel.send('fim da pausa');
                message.channel.send(secondsToTimerStr(0)).then((sentMsg) => {
                    guildsTimersMsgs[id] = sentMsg;
                })
            },
            () => {
                message.channel.send('fim da pausa longa');
                delete guildsTimersMsgs[id];
                delete guildsPomdoros[id];
            }
        )
    }



    // Voice only works in guilds, if the message does not come from a guild,
    // we ignore it
    if (!message.guild) return;

    switch (command) {
        case 'start':
            playSound(message, "valendo");
            console.log('start command')
            let ms = args.length >= 1 &&  !isNaN(parseInt(args[0])) ? parseInt(args[0]) * 60 * 1000 : 25 * 60 * 1000;
            guildsPomdoros[id].start();
            message.channel.send(secondsToTimerStr(0)).then((sentMsg) => {
                guildsTimersMsgs[id] = sentMsg;
            }).catch(err => {
                console.log('error sending msg');
                console.error(err)
            })
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

} 