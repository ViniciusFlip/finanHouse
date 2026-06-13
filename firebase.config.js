// firebase.config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
    initializeFirestore,
    persistentLocalCache,
    collection,
    addDoc,
    getDocs,
    updateDoc,
    query,
    orderBy,
    doc,
    deleteDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
 apiKey: "AIzaSyAChdrY05XhKerQvfjWl69BeEEqLKTfqC0",
  authDomain: "finanhouse-bcf72.firebaseapp.com",
  projectId: "finanhouse-bcf72",
  storageBucket: "finanhouse-bcf72.firebasestorage.app",
  messagingSenderId: "765310974104",
  appId: "1:765310974104:web:949263b7197143c813f8ed"
};

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {
    localCache: persistentLocalCache()
});

export {
    db,
    collection,
    addDoc,
    getDocs,
    updateDoc,
    query,
    orderBy,
    doc,
    deleteDoc,
    serverTimestamp
};