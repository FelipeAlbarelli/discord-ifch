import { Client, Message  } from 'discord.js';
import config  from '../../config'
import { secondsToTimerStr , PomodoroMachine } from '../functions/pomodoro';

// readFile('./audio/valendo.mp3', (err , data) => {
//     console.log(err);
//     console.log(data);
// })

const {prefix} = config;
const intervalMs = config.pomodoro.intervalMs
const timeOutDict = {};
const pomodoroCicleDict = {};

const guildsPomdoros: { [key: string]: PomodoroMachine;} = {}

const playSound = async (message: Message) => {
    try {
        const connection = await message.member.voice.channel.join();
        // console.log(connection);
        const dispatcher = connection.play('./audio/valendo.mp3', {
            volume: 0.1
        });

        dispatcher.on('start', () => {
            console.log('audio.mp3 is now playing!');
        });

        dispatcher.on('finish', () => {
            console.log('audio.mp3 has finished playing!');
            connection.disconnect();
        });

        // Always remember to handle errors appropriately!
        dispatcher.on('error', console.error);
    } catch (error) {
        console.error(error);
    }
}

export const handleMessage = (message: Message) => {

    // console.log(message.guild.id);
    // console.log(message.channel);

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // Voice only works in guilds, if the message does not come from a guild,
    // we ignore it
    if (!message.guild) return;

    switch (command) {
        case 'start':
            let ms = args.length >= 1 &&  !isNaN(parseInt(args[0])) ? parseInt(args[0]) * 60 * 1000 : 25 * 60 * 1000;
            // impedir num muito grandes
            // playSound(message);
            let timer = 0;
            const timerMsg = message.channel.send(secondsToTimerStr(timer));
            const interval = setInterval( () => {
                timer += Math.floor(intervalMs/1000);
                timerMsg.then(sentMsg => {
                    sentMsg.edit(secondsToTimerStr(timer));
                }).catch();
            },
            intervalMs)
            const timeOut = setTimeout( () => {
                message.channel.send('fim do pomodoro');
                timeOutDict[message.guild.id] = undefined;
                clearInterval(interval);
            }, ms);
            timeOutDict[message.guild.id] = timeOut;
            break;
        case 'cancelar':
            if (timeOutDict[message.guild.id] !== undefined) {
                clearTimeout(timeOutDict[message.guild.id] as NodeJS.Timeout);
                message.channel.send('pomodoro cancelado');
                timeOutDict[message.guild.id] = undefined;
            } else {

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

} 