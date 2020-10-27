import {db} from './config';
import { Client } from 'discord.js';
import { handleMessage } from './discord/discord';

const discordClient = new Client();

const botToken = process.env.BOTTOKEN;

discordClient.login(botToken)
.then(() => {
        console.log('Discord bot connected :D')
})
.catch(err => {
console.log('Error: cant connect to discord.js');
console.error(err);
});

discordClient.on('message', async message => {
handleMessage(message);
});
