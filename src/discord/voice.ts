import { Message } from "discord.js";
import {readFile} from 'fs';
import ytdl from 'ytdl-core'

type sound = 'valendo' | 'parou';

const soundsLocations = {
    'valendo' : 'audio/valendo.mp3',
    'parou' : 'audio/parou.mp3'
}

// readFile(url , (err , data) => {
//     if (err) return console.log(err)
//     console.log(data.length)
// })


export const playSound = async (message: Message , sound : sound) => {
    try {
        const connection = await message.member?.voice.channel?.join();
        // console.log(connection);
        const dispatcher = connection?.play(
            // ytdl('https://youtu.be/aJctI5q2UY0')
            soundsLocations[sound]
        , {
            volume: 1
        });
            
        dispatcher.on('start', () => {
            console.log('audio.mp3 is now playing!');
            setTimeout( () => {
            connection.disconnect();
        }, 1000)
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