
// const voice

//       if (message.member.voice.channel) {
//         const connection = await message.member.voice.channel.join();
//         console.log(connection);
//         const dispatcher = connection.play('audio/valendo.mp3');

//         dispatcher.on('start', () => {
//             console.log('audio.mp3 is now playing!');
//         });

//         dispatcher.on('finish', () => {
//             console.log('audio.mp3 has finished playing!');
//             connection.disconnect();
//         });

//         // Always remember to handle errors appropriately!
//         dispatcher.on('error', console.error);
//       } else {
//         message.reply('You need to join a voice channel first!');
//       }