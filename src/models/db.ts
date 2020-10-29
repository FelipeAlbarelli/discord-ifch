import * as admin from 'firebase-admin';

export interface dbUser {
    discordId : string;
}

export interface Pomodoro {
    userId : string;
    date: admin.firestore.Timestamp
    tag: string;
}

export interface Guild {
    discordId : string;
    preferences : {
        pomodoroDuration?: number;
        shortRestDuration?: number;
        longRestDuration?: number;
        ciclesUntilLongPause?: number;
    }
}