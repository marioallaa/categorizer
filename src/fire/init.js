// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyANR1eCLUcaCDC0QMYLIvwtiG2A8n8LNEQ",
  authDomain: "categorizer-ai.firebaseapp.com",
  projectId: "categorizer-ai",
  storageBucket: "categorizer-ai.appspot.com",
  messagingSenderId: "767663731868",
  appId: "1:767663731868:web:355dedb009a3b4b604e959",
  measurementId: "G-YRFCJFLF8S"
};



// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const analytics = getAnalytics(app);
export const db = getFirestore(app)