// src/utils/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your Firebase project config
const firebaseConfig = {
    apiKey: "AIzaSyAjYowc6Tr2mwZu9bQHjPy7YWDt4MT3bKE",
    authDomain: "luyona.firebaseapp.com",
    projectId: "luyona",
    storageBucket: "luyona.firebasestorage.app",
    messagingSenderId: "329639088990",
    appId: "1:329639088990:web:d4e376a90a7fbaed5d75cf"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 