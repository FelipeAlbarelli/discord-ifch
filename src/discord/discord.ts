import {  Client, DMChannel, Message, NewsChannel, TextChannel, VoiceChannel  } from 'discord.js';
import defaultConfig  from '../config'
import { addPomodoro, countUserPomdoros } from '../db/pomodoros_legacy';
import {PomodoroTextController} from '../functions/pomodoroTextController';
// import { createDiscordPomodoro } from './discordPomodoro';
import { playSoundDiscord } from './voice';
import { getUser } from '../db/discord'

const {prefix} = defaultConfig;

const pomodoroCtrl = new PomodoroTextController();

const handleDM = async (message: Message, voiceChanel, command) => {

    try {
        const discordId = message.author.id;
        const user = await getUser(discordId);

        message.reply(
            `total money: ${user?.money ?? 0 }` + `\n` +
            `total pomodoros : ${user?.pomodoros?.length ?? 0}`
        )

    } catch (err) {
        console.error(err)
    }

    
}

const getInfoFromComment = (message: Message) => {
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    return  {
        channel: message.channel,
        voiceChanel : message.member?.voice.channel,
        args,
        command: args.length ? args[0].toLowerCase() : null,
        isCommandToBot: message.content[0] == prefix
    }
}

export const handleMessage = (message: Message , client: Client) => {

    if (message.author.bot) {
        return;
    }

    const { channel , args , command , voiceChanel ,isCommandToBot } = getInfoFromComment(message);

    console.log(isCommandToBot)

    if (channel instanceof DMChannel){
        handleDM(message, voiceChanel, command);
        return;
    } else if (channel instanceof NewsChannel) {
        return;
    } else {
        if (!isCommandToBot) {
            return;
        }
        if (voiceChanel === null) {
            message.reply('junte-se a um canal de voz para usar os comandos do bot');
            return;
        }
        handleTextChanelMsg(channel , voiceChanel,  command , args.slice(1) , client)
        .then(() => {})
        .catch(() => {});
    }

    // const guildId = message.guild ? message.guild.id : null;
    // if (guildId === null) return;


    // handleCommandTextChanel(channel,voiceChanel,command);

} 

const commandsArrayToText = (x : string[]) => x.map(s => `''\\${prefix}${s}''` ).join(", ")

const helpText = () => {
    return `Começar um pomodoro: ${commandsArrayToText(textCommands.start)} 
Pausar um pomodoro: ${commandsArrayToText(textCommands.pause)}
Retomar um pomodoro: ${commandsArrayToText(textCommands.resume)} 
Cancelar ciclo: ${commandsArrayToText(textCommands.cancel)}
Modo soneca (5 min extra de pausa): ${commandsArrayToText(textCommands.sleep)}`
}

const textCommands = {
    start:  ['start' , 'comecar' , 'começar' , 'valendo' , 'bora' , 'bo'],
    pause:  ['pausa' , 'pause'],
    resume: ['resume' , 'retomar' , 'volta' , 'voltar'],
    cancel: ['cancel' , 'cancelar' , 'stop'],
    sleep:  ['sleep' , 'soneca']
};

const handleTextChanelMsg = async (textChanel: TextChannel, voiceChanel: VoiceChannel ,command: string , args: string[] , client: Client) => {
    
    if (textCommands.start.includes(command)) {
        await pomodoroCtrl.startPomodoro(textChanel , voiceChanel);
    } else if (textCommands.pause.includes(command)) {
        pomodoroCtrl.pause(textChanel , voiceChanel)
    } else if (textCommands.resume.includes(command)) {
        pomodoroCtrl.resume(textChanel , voiceChanel);
    } else if (textCommands.cancel.includes(command)) {
        pomodoroCtrl.cancel(textChanel , voiceChanel);
    } else if (textCommands.sleep.includes(command)) {
        pomodoroCtrl.soneca(textChanel , voiceChanel);
    } else {
        textChanel.send(helpText());
    }

}
