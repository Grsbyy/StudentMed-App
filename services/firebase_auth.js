// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRhrRsyXCr4kRYjDyaqBXU7takeTVSFr8",
  authDomain: "studentmed-d554c.firebaseapp.com",
  projectId: "studentmed-d554c",
  storageBucket: "studentmed-d554c.appspot.com",
  messagingSenderId: "539979970488",
  appId: "1:539979970488:web:a3e02f8f35be135759014d"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);

export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
export const FIRESTORE_MSG = getMessaging(FIREBASE_APP);