import { Client } from 'discord.js';
import { handleMessage } from './discord/discord';
import config from './config';

const {botToken} = config;

const discordClient = new Client();

discordClient.login(botToken)
.then(() => {
	console.log('Discord bot connected :D', discordClient.user.username)
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