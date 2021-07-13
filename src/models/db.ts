import * as admin from 'firebase-admin';

export interface UserDB {
    discordId :number | string;
    pomodoros : string[];
    money: number;
}

export interface RewardsConfig {
    cicle : number,
    pomodoro : number,
    wish : number,
    wishPack : number
}