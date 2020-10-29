import {db} from './config';
import {Guild,Pomodoro,dbUser} from '../models/db';
import { User, VoiceChannel } from 'discord.js';
import { firestore } from 'firebase-admin';

const names = {
    pomodoros: 'pomodoros',
    users: 'users'
}

const pomodorosDb = db.collection('pomdoros');

const usersDb = db.collection('users');

const guildsDb = db.collection('guilds');

const herror = console.error;

export const createUser = async (user : User) => {
    try {
        await usersDb.add({
            discordId: user.id
        })
    } catch (err) {
        herror(err);
    }
}


export const countUserPomdoros = async (
    discordUserId: string , 
    when : 'always' | 'this_week' |'last_week' | 'this_month' | 'last_month'
): Promise<number> => {
    try {
        console.log(discordUserId);
        const userRef = await usersDb.where('discordId','==',discordUserId).limit(1).get();
        const userId = userRef.docs[0].id;
        console.log(userId);
        return (await usersDb.doc(userId).collection(names.pomodoros).get()).size;
    } catch (err) {
        herror(err);
        return null;
    }
}

export const addPomodoro = async ( discordId: string) => {
    try {
        let userId;
        const userRef = await usersDb.where('discordId' , '==' , discordId).limit(1).get();
        if (userRef.empty) {
            userId = (await usersDb.add({discordId})).id;
            console.log('user novo' , userId)
        } else {
            userId = userRef.docs[0].id;
            console.log('user velho' , userId);
        }
        usersDb.doc(userId).collection(names.pomodoros).add({
            date: firestore.Timestamp.now()
        })
    } catch (err) {
        herror(err)
    }
}