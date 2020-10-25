require('dotenv').config();
import { Client } from 'discord.js';
import { handleMessage } from './discord/discord';
import { db } from './db/config';

// import { prefix, dbName, pomodorosCollectionName, usersColletionName, guildsCollectionName } from '../config';

const discordToken = process.env.BOTTOKEN;

const discordClient = new Client();

const ref = db.collection('pomodoros').doc('felipe').get().then( result => {
    if (result.exists){
        console.log(result.data())
    } else {
        console.log('not found')
    }
}).catch(console.error)

discordClient.once('ready', () => {
    console.log('Discord is Ready :D');
});

discordClient.login(discordToken);


discordClient.on('message', async message => {
    handleMessage(message);
    // if (!message.content.startsWith(prefix) || message.author.bot) return;
    
    // const args = message.content.slice(prefix.length).trim().split(/ +/);
    // const command = args.shift().toLowerCase();

    // // Voice only works in guilds, if the message does not come from a guild,
    // // we ignore it
    // if (!message.guild) return;
  
    // if (command === 'join') {
    //   // Only try to join the sender's voice channel if they are in one themselves
    //   if (message.member.voice.channel) {
    //     const connection = await message.member.voice.channel.join();
    //     console.log(connection);
    //     const dispatcher = connection.play('audio/valendo.mp3');

    //     dispatcher.on('start', () => {
    //         console.log('audio.mp3 is now playing!');
    //     });

    //     dispatcher.on('finish', () => {
    //         console.log('audio.mp3 has finished playing!');
    //         connection.disconnect();
    //     });

    //     // Always remember to handle errors appropriately!
    //     dispatcher.on('error', console.error);
    //   } else {
    //     message.reply('You need to join a voice channel first!');
    //   }
    // }
    // if (command === 'add') {
    //     pomodorosColl.insertOne({
    //         name: message.author.username,
    //         msg: args
    //     })
    //     .then(result => {
    //         console.log(result)
    //     })
    //     .catch(console.error)
    // }
    // if (command === 'read') {
    //     pomodorosColl.countDocuments()
    // }

});