// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from 'firebase/auth';
import {getFirestore} from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyASHgKmirG-46NTpUVhSndP5brOk8_Ue7U",
    authDomain: "primeprep-9f06c.firebaseapp.com",
    projectId: "primeprep-9f06c",
    storageBucket: "primeprep-9f06c.firebasestorage.app",
    messagingSenderId: "659871150380",
    appId: "1:659871150380:web:1c8b96961016791b6fbc89",
    measurementId: "G-EM57J99B93"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);