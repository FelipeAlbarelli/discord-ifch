import { Message } from "discord.js";
import {readFile} from 'fs';

type sound = 'valendo' | 'parou';

const soundsLocations = {
    'valendo' : 'gs://pomodoro-20272.appspot.com/audios/valendo.mp3',
    'parou' : 'gs://pomodoro-20272.appspot.com/audios/parou.mp3'
}


readFile('./audio/valendo.mp3' , (err , data) => {
    if (err) return console.log(err)
    console.log(data.length)
})

export const playSound = async (message: Message , sound : sound) => {
    try {
        const connection = await message.member?.voice.channel?.join();
        // console.log(connection);
        const dispatcher = connection?.play(soundsLocations[sound], {
            volume: 1
        });

        dispatcher?.on('start', () => {
            console.log('audio.mp3 is now playing!');
        });

        dispatcher?.on('finish', () => {
            console.log('audio.mp3 has finished playing!');
            connection?.disconnect();
        });

        // Always remember to handle errors appropriately!
        dispatcher?.on('error', console.error);
    } catch (error) {
        console.error(error);
    }
}