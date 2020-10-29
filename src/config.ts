if (process.env.NODE_ENV === 'local') {
	console.log('local')
	require('dotenv').config()
} else {
	console.log('prod')
}

export const log = msg => {
    process.env.NODE_ENV ? console.log(msg) : null;
}

const defaultConfig = {
    prefix: "*",
    dbName: "pomodorosDb",
    pomodorosCollectionName: "pomodoros",
    usersColletionName: "users",
    guildsCollectionName: "guilds",
    pomodoro : {
        intervalMs : 2*1000,
        restMin: .3,
        workMin: .3,
        longRestMin: .3,
        pomodorosUntilLongRest: 2
    },
    local : process.env.NODE_ENV === 'local',
    botToken : process.env.NODE_ENV === 'local' ?
        process.env.BOTTOKENTEST :
        process.env.BOTTOKEN
}

export default defaultConfig;