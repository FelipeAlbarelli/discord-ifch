import { Client } from 'discord.js';
import { handleMessage } from './discord/discord';

if (process.env.USERDOMAIN === 'FELIPEALBARELLI') {
	console.log('local')
	require('dotenv').config()
} else {
	console.log('prod')
}

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

var http = require('http');

http.createServer(function (req, res) {
  res.write("I'm alive");
  res.end();
}).listen(8080);

discordClient.on('message', message => {
        handleMessage(message);
});