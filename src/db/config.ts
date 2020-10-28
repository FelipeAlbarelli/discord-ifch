import * as admin from 'firebase-admin';
require('dotenv').config()

const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pomodoro-20272.firebaseio.com"
});

export const db = app.firestore();