import "firebase/auth";
import "firebase/firestore";
import admin from 'firebase-admin';
import serviceAccount from '../../serviceAccountKey.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
  databaseURL: "https://pomodoro-20272.firebaseio.com"
});

export const db = admin.firestore();

// const docRef = db.collection('pomodoros').doc('felipe');

// let setFelipe = docRef.set({
//     first : 'a!!',
//     last: 'b'
// }).then(() => {
//     console.log('joia')
// }).catch((err) => {
//     console.log('*'.repeat(20));
//     console.log(err);
// });

