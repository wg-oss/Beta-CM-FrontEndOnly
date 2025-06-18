import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDKzwGwWKOQ8vUdzZuflIMieJYKVivLK-s",
  authDomain: "contractmatch-ef2c5.firebaseapp.com",
  projectId: "contractmatch-ef2c5",
  storageBucket: "contractmatch-ef2c5.firebasestorage.app",
  messagingSenderId: "970578936002",
  appId: "1:970578936002:web:a3eed296badf5b28f1bb5b",
  measurementId: "G-84YB3L31NC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); 