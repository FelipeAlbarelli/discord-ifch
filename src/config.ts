require('dotenv').config()
export const local = () => process.env.NODE_ENV === 'local';
if (local) {
	console.log('local')
} else {
	console.log('prod')
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