import { Client } from 'discord.js';
import { handleMessage } from './discord/discord';
import config from './config';

const {botToken} = config;

const discordClient = new Client();

console.log({botToken});

console.log(process.env.NODE_ENV);

discordClient.login(botToken)
.then(() => {
	console.log('Discord bot connected :D', discordClient.user.username)
})
.catch(err => {
	console.log('Error: cant connect to discord.js');
	console.error(err);
});

discordClient.on('message', message => {
    handleMessage(message , discordClient);
});