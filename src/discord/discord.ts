import {  Client, DMChannel, Message, NewsChannel, TextChannel, VoiceChannel  } from 'discord.js';
import defaultConfig  from '../config'
import { addPomodoro, countUserPomdoros } from '../db/pomodoros';
import { secondsToTimerStr , PomodoroMachine } from '../functions/pomodoroMachine';
import {PomodoroTextController} from '../functions/pomodoroTextController';
// import { createDiscordPomodoro } from './discordPomodoro';
import { playSoundDiscord } from './voice';


const {prefix} = defaultConfig;

const pomodoroCtrl = new PomodoroTextController();

const handleDM = (message: Message, voiceChanel, command) => {

    countUserPomdoros(message.author.id, 
        command === 'today' ?
        'today' :
        (command === 'week' ?
        'this_week' :
        'always')
        ).then( r => {
        message.reply(`pomodoros registrados : ${r}`)
    })
}

// const handleCommandTextChanel = (textC: TextChannel, voiceC: VoiceChannel, command: string, pars?: string[]) => {

//     const voiceId = voiceC.id;

//     switch (command) {
//         case 'começar':
//         case 'valendo':
//         case 'start':
//             if (guildsPomdoros[voiceId] === undefined) {
//                 guildsPomdoros[voiceId] = createDiscordPomodoro(textC, voiceC);
//             }
//             // playSound(voiceC, "valendo").catch(hEr);
//             if (guildsPomdoros[voiceId].pomodoring === true ) {
//                 textC.send(`já está ocorrendo um pomodoro no canal ${textC.name}`);
//                 return;
//             }
//             guildsPomdoros[voiceId].start();
//             break;
//         case 'stop':
//         case 'cancelar':
//             guildsPomdoros[voiceId].cancelOne();
//             delete guildsPomdoros[voiceId];
//             textC.send('pomodoro cancelado')
//             break;
//         case 'status':
//             if (guildsPomdoros[voiceId] == undefined){
//               textC.send("bot inativo");
//               return;
//             }
//             textC.send(
//               guildsPomdoros[voiceId].active ?
//               (guildsPomdoros[voiceId].pomodoring ?
//               'em concentração' :
//               'em pausa') :
//               'bot inativo'
//             )
//             break;
//         case 'test-sound':
//             playSound(voiceC, "valendo");
//             break;
//         case 'ajuda':
//         case 'help':
//           textC.send(
//             `lista de comandos:\n`+
//             ` ${prefix}start: começa ciclo de pomodoro\n`+
//             ` ${prefix}cancelar: cancela ciclo de pomoro\n` +
//             ` ${prefix}status: informa se o estado atual é "concentração", "pausa" ou "inativo"`
//             );
//           break;
//         default:
//           textC.send(`comando ${command} inexistente, use ${prefix}help para uma breve lista de comandos`);
//           break;
//     }
// }

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
Modo soneca (5 min extra de pausa): ${commandsArrayToText(textCommands.sleep)} `
}

const textCommands = {
    start: ['start' , 'comecar' , 'começar' , 'valendo' , 'bora'],
    pause: ['pausa' , 'pause'],
    resume: ['resume' , 'retomar' , 'volta' , 'voltar'],
    cancel: ['cancel' , 'cancelar' , 'stop'],
    sleep: ['sleep' , 'soneca']
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