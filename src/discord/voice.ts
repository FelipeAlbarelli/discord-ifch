import { Message } from "discord.js";

export const playSound = async (message: Message , sound : 'valendo' | 'parou') => {
    try {
        const connection = await message.member.voice.channel.join();
        // console.log(connection);
        const dispatcher = connection.play(`./audio/${sound}.mp3`, {
            volume: .7
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