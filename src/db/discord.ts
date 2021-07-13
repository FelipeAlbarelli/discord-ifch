import {db} from './config';
import {VoiceChannel } from 'discord.js';
import { firestore } from 'firebase-admin';
import {UserDB , RewardsConfig} from '../models/db';
import {local} from '../config';
import {increment} from './utils'
import * as admin from 'firebase-admin';


const userCollection = db.collection('users_2' + (local ? '__test' : ''));
const configCollection = db.collection('config');

console.log(local)

const getUser = async (id : number | string , possibleEmpty = true) => {
    try {
        const userSnap = await userCollection.doc(`${id}`).get();
        if (!userSnap.exists) {
            if (possibleEmpty) {
                return null;
            } else {
                throw new Error("No user found with given id " + id);
            }
        }
        return userSnap.data() as UserDB;
    } catch (error) {
        console.error(error);
    }
} 

const createUser = async (user : UserDB) => {
    try {
        await userCollection.doc(`${user.discordId}`).set(user);
    } catch (err) {
        console.error(err);
    }
}

const getBlanckUser = (discordId : number | string) => {
    return {
        discordId : `${discordId}`,
        money : 0,
        pomodoros : [],
    } as UserDB 
}

const getRewardConfig = async () => {
    return ( await configCollection.doc('rewards').get()).data() as RewardsConfig;
}

export const createUserIfNew = async (discordIds: Array<number | string>)  => {
    const createPromise = discordIds.map( async (id) => {
        try {
            const user = await getUser(id , true);
            if (user === null) {
                const newUser = getBlanckUser(`${id}`);
                await createUser(newUser);
                console.log(`new user created`)
            } else {
                console.log(`user ${id} was already in system`)
            }
        } catch (err) {
            return Promise.resolve()
        }
    })
}

export const addPomodoros = async (discordIds : Array<string | number> , cicleEnd = false ) => {
    const now = admin.firestore.Timestamp.now();
    const {pomodoro , cicle} = await getRewardConfig();
    const updatePromise = discordIds.map( async (id) => {
        try {
            await userCollection.doc(`${id}`).update({
                pomodoros : admin.firestore.FieldValue.arrayUnion(now),
                money : increment(cicleEnd ? pomodoro + cicle : pomodoro)
            })
        } catch (err) {
            console.log(err);
        }
    })
    await Promise.all(updatePromise);
}