import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDRH2lMJ0qXWi1AxR5auh_0u2tqRkCM5Lo",
  authDomain: "react-feed-199bb.firebaseapp.com",
  projectId: "react-feed-199bb",
  storageBucket: "react-feed-199bb.appspot.com",
  messagingSenderId: "784495743793",
  appId: "1:784495743793:web:5f4600e53364fe2f335610",
  measurementId: "G-7JVNL9W2BS"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, storage, auth };