"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("firebase/auth");
require("firebase/firestore");
var firebase_admin_1 = __importDefault(require("firebase-admin"));
var serviceAccountKey_json_1 = __importDefault(require("./serviceAccountKey.json"));
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccountKey_json_1.default),
    databaseURL: "https://pomodoro-20272.firebaseio.com"
});
var db = firebase_admin_1.default.firestore();
var docRef = db.collection('pomodoros').doc('felipe');
var setFelipe = docRef.set({
    first: 'a!!',
    last: 'b'
}).then(function () {
    console.log('joia');
}).catch(function (err) {
    console.log('*'.repeat(20));
    console.log(err);
});
