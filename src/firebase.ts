import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyD4MSRfSoDrebY0n7BeBznVjiWhvchiZ8U",
    authDomain: "building-ballot-ext.firebaseapp.com",
    databaseURL: "https://building-ballot-ext.firebaseio.com",
    projectId: "building-ballot-ext",
    storageBucket: "building-ballot-ext.appspot.com",
    messagingSenderId: "513409427626",
    appId: "1:513409427626:web:967ce8299387dc149888d3",
    measurementId: "G-JD0EJJ5PDC"
});

export const db = firebaseApp.database();
export default firebaseApp;