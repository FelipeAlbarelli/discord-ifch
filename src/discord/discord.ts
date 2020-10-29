import {  DMChannel, Message, NewsChannel, TextChannel, VoiceChannel  } from 'discord.js';
import defaultConfig  from '../config'
import { addPomodoros, countUserPomdoros } from '../db/pomodoros';
import { secondsToTimerStr , PomodoroMachine } from '../functions/pomodoro';
import { createDiscordPomodoro } from './discordPomodoro';
import { playSound } from './voice';


const {prefix} = defaultConfig;

const guildsPomdoros: { [key: string]: PomodoroMachine;} = {}

const handleDM = (message: Message, voiceChanel) => {
    countUserPomdoros(message.author.id, 'always').then( r => {
        message.reply(`pomodoros registrados : ${r}`)
    })
}

const handleCommandTextChanel = (textC: TextChannel, voiceC: VoiceChannel, command: string, pars?: string[]) => {

    const voiceId = voiceC.id;

    switch (command) {
        case 'start':
            if (guildsPomdoros[voiceId] === undefined) {
                guildsPomdoros[voiceId] = createDiscordPomodoro(textC, voiceC);
            }
            // playSound(voiceC, "valendo").catch(hEr);
            if (guildsPomdoros[voiceId].pomodoring === true ) {
                textC.send(`já está ocorrendo um pomodoro no canal ${textC.name}`);
                return;
            }
            guildsPomdoros[voiceId].start();
            break;
        case 'cancelar':
            guildsPomdoros[voiceId].cancelOne();
            textC.send('pomodoro cancelado')
            break;
        case 'status':
            textC.send(
              guildsPomdoros[voiceId].active ?
              (guildsPomdoros[voiceId].pomodoring ?
              'em concentração' :
              'em pausa') :
              'bot inativo'
            )
            break;
        case 'test-sound':
            playSound(voiceC, "valendo");
            break;
        case 'help':
          textC.send(
            `lista de comandos:\n`+
            ` ${prefix}start: começa ciclo de pomodoro\n`+
            ` ${prefix}cancelar: cancela ciclo de pomoro\n` +
            ` ${prefix}status: informa se o estado atual é "concentração", "pausa" ou "inativo"`
            );
          break;
        default:
          textC.send(`comando ${command} inexistente, use ${prefix}help para uma breve lista de comandos`);
          break;
    }
}

export const handleMessage = (message: Message) => {

    if (message.author.bot) return;
    
    const channel = message.channel;
    const voiceChanel = message.member.voice.channel;

    if (channel instanceof DMChannel){
        handleDM(message, voiceChanel);
        return;
    } else if (channel instanceof NewsChannel) {
        return;
    } 

    if (!message.content.startsWith(prefix)) return;

    const _args = message.content.slice(prefix.length).trim().split(/ +/);
    const command =  _args.length ? _args[0].toLowerCase() : null;

    const guildId = message.guild ? message.guild.id : null;
    if (guildId === null) return;

    handleCommandTextChanel(channel,voiceChanel,command);

} 