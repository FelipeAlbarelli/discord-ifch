const local = process.env.NODE_ENV === 'local';
if (local) {
	console.log('local')
	require('dotenv').config()
} else {
	console.log('prod')
}

export const log = msg => {
    process.env.NODE_ENV ? console.log(msg) : null;
}

const defaultConfig = {
    prefix: local ? "*" : "¬",
    dbName: "pomodorosDb",
    pomodorosCollectionName: "pomodoros",
    usersColletionName: "users",
    guildsCollectionName: "guilds",
    pomodoro : {
        intervalMs : 30*1000,
        restMin: 5,
        workMin: 25,
        longRestMin: 15,
        pomodorosUntilLongRest: 4
    },
    local,
    botToken : local ?
        process.env.BOTTOKENTEST :
        process.env.BOTTOKEN
}

export default defaultConfig;