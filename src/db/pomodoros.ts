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
    when : 'always' | 'today' |'this_week' |'last_week' | 'this_month' | 'last_month'
): Promise<number> => {
    try {
        console.log(discordUserId);
        const userRef = await usersDb.where('discordId','==',discordUserId).limit(1).get();
        const userId = userRef.docs[0].id;
        let query = usersDb.doc(userId).collection(names.pomodoros);
        let newQuery;
        switch (when) {
            case 'today':
                const today = new Date();
                today.setHours(0,0,0);
                newQuery = query.where('date' , '>=' , firestore.Timestamp.fromDate(today) );
                break;
            case 'this_week':
                const now = new Date();
                const weekBegDay = now.getDate() - now.getDay();
                const weekBeggDate = new Date (now.setDate(weekBegDay));
                newQuery = query.where('date' , '>=' ,  firestore.Timestamp.fromDate(weekBeggDate));
                break;
            default:
                break;
        }

        if (newQuery !== undefined) {
            return (await newQuery.get()).size;

        }
        return (await query.get()).size;
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