import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDRhrRsyXCr4kRYjDyaqBXU7takeTVSFr8",
    authDomain: "studentmed-d554c.firebaseapp.com",
    projectId: "studentmed-d554c",
    storageBucket: "studentmed-d554c.appspot.com",
    messagingSenderId: "539979970488",
    appId: "1:539979970488:web:a3e02f8f35be135759014d"
};

const firebaseApp = initializeApp(firebaseConfig);

const firestore = getFirestore(firebaseApp);

const firebaseStorage = getStorage(firebaseApp);
export {
    firestore, firebaseStorage
};