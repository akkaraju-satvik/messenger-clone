/* eslint-disable no-unused-vars */
import firebase from 'firebase';

const fireabaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAxh5C2o45wRda-ibWxuoTlHaCRrNhHT-c",
    authDomain: "hola-by-satvik.firebaseapp.com",
    projectId: "hola-by-satvik",
    storageBucket: "hola-by-satvik.appspot.com",
    messagingSenderId: "561872151194",
    appId: "1:561872151194:web:72a14054b69b7fa82ef523",
    measurementId: "G-4EGJV9P3J2"
});

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
