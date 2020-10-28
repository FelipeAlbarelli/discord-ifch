import {db} from './config';
import {Guild,Pomodoro,dbUser} from '../models/db';
import { User, VoiceChannel } from 'discord.js';
import { firestore } from 'firebase-admin';


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

export const addPomodoros = async ( vc: VoiceChannel) => {
    try {
        const users = vc.members.map( mem => ({
            userId : mem.user.id,
            date: firestore.Timestamp.now()
        }))
        users.forEach( async user => {
            await pomodorosDb.add(user)
        })
    }catch (err) {
        herror(err)
    }
}