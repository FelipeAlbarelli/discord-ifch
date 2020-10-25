const config = {
    prefix: "¬",
    dbName: "pomodorosDb",
    pomodorosCollectionName: "pomodoros",
    usersColletionName: "users",
    guildsCollectionName: "guilds",
    pomodoro : {
        intervalMs : 10*1000,
        restMin: .5,
        workMin: .5,
        longRestMin: 15,
        pomodorosUntilLongRest: 2
    }
}

export default config;