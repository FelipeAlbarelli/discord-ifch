import {  DMChannel, Message  } from 'discord.js';
import defaultConfig  from '../config'
import { addPomodoros, countUserPomdoros } from '../db/pomodoros';
import { secondsToTimerStr , PomodoroMachine } from '../functions/pomodoro';
import { playSound } from './voice';

const hEr = (err: any) => {
    console.error(err)
}

const isDm = (msg: Message) => msg.channel instanceof DMChannel; 

const {prefix} = defaultConfig;

const guildsPomdoros: { [key: string]: PomodoroMachine;} = {}

const guildsTimersMsgs: {[key: string]: Message;} = {};

export const handleMessage = (message: Message) => {

    console.log(`got msg ${message.content}`);
    
    if (isDm(message) && !message.author.bot){
        countUserPomdoros(message.author.id, 'always').then( r => {
            message.reply(`pomodoros registrados : ${r}`)
        })
    }

    if (!message.content.startsWith(prefix) || message.author.bot) return;


    const _args = message.content.slice(prefix.length).trim().split(/ +/);
    const command =  _args.length ? _args[0].toLowerCase() : null;
    // const args = _args.length > 1 ? _args.slice(1) : [];

    // console.log(message.guild.id);
    // console.log(message.channel);
    const id = message.guild ? message.guild.id : null;
    if (id === null) return;
    console.log(`pomodoroMachine:`);
    console.log(guildsPomdoros[id]);



    if (guildsPomdoros[id] === undefined) {
        console.log('creating pomodoro machine')
        guildsPomdoros[id] = new PomodoroMachine(
            (ms: number) => {
                if (guildsTimersMsgs[id] !== undefined) {
                    guildsTimersMsgs[id].edit(secondsToTimerStr(ms/1000)).catch(hEr)
                };
            },
            (numPomo: number) => {
                message.channel.send(`fim do pomodoro #${numPomo}`).catch(hEr);
                playSound(message , 'parou').catch(hEr);
                message.channel.send(secondsToTimerStr(0)).then((sentMsg) => {
                    guildsTimersMsgs[id] = sentMsg;
                }).catch(hEr);
                addPomodoros(message.member.voice.channel).then( () => {
                    console.log('pomodoro registrado em fb com sucesso')
                }).catch(hEr);
            },
            () => {
                playSound(message, "valendo").catch(hEr);
                message.channel.send('fim da pausa').catch(hEr);
                message.channel.send(secondsToTimerStr(0)).then((sentMsg) => {
                    guildsTimersMsgs[id] = sentMsg;
                }).catch(hEr)
            },
            () => {
                message.channel.send('fim da pausa longa').catch(hEr);
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
            playSound(message, "valendo").catch(hEr);
            console.log('start command')
            guildsPomdoros[id].start();
            message.channel.send(secondsToTimerStr(0)).then((sentMsg) => {
                guildsTimersMsgs[id] = sentMsg;
            }).catch(err => {
                console.log('error sending msg');
                console.error(err)
            })
            break;
        case 'cancelar':
            guildsPomdoros[id].cancelOne();
            message.channel.send('pomodoro cancelado')
            break;
        case 'status':
            message.channel.send(
              guildsPomdoros[id].active ?
              (guildsPomdoros[id].pomodoring ?
              'em concentração' :
              'em pausa') :
              'bot inativo'
            )
            break;
        case 'test-sound':
            playSound(message, "valendo");
            break;
        case 'help':
          message.channel.send(
            `lista de comandos:\n`+
            ` ${prefix}start: começa ciclo de pomodoro\n`+
            ` ${prefix}cancelar: cancela ciclo de pomoro\n` +
            ` ${prefix}status: informa se o estado atual é "concentração", "pausa" ou "inativo"`
            );
          break;
        default:
          message.reply(`comando inexistente, use ${prefix}help para uma breve lista de comandos`);
          break;
    }

} 