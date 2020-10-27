
// import { Client } from 'discord.js';
// import { handleMessage } from './discord/discord';

// const discordClient = new Client();

// const botToken = process.env.BOTTOKEN;

// discordClient.login(botToken)
// .then(() => {
//         console.log('Discord bot connected :D')
// })
// .catch(err => {
// console.log('Error: cant connect to discord.js');
// console.error(err);
// });

// discordClient.on('message', message => {
//         handleMessage(message);
// });
if (process.env.USERDOMAIN === 'FELIPEALBARELLI') {
    console.log('local')
} else {
	console.log('prod')
}