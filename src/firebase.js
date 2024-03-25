import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCE7_gYf1UZ-KgfRS45xPKYkAy0S5GxYbk",
    authDomain: "mymedicosupdated.firebaseapp.com",
    databaseURL: "https://mymedicosupdated-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "mymedicosupdated",
    storageBucket: "mymedicosupdated.appspot.com",
    messagingSenderId: "968103235749",
    appId: "1:968103235749:web:403b7c7a79c3846fedbd4c",
    measurementId: "G-B66D4LFS4J"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
