import { initializeApp } from 'firebase/app';
import { browserLocalPersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDwCURVjXthIBa2Zcc8r9puYrxg4nV7FOI',
  authDomain: 'meet-writing.firebaseapp.com',
  projectId: 'meet-writing',
  storageBucket: 'meet-writing.appspot.com',
  messagingSenderId: '852885568219',
  appId: '1:852885568219:web:6b43ad5f5505da9ae6aafe',
};

export const firebase = initializeApp(firebaseConfig);
export const auth = initializeAuth(firebase, { persistence: browserLocalPersistence });
export const db = getFirestore(firebase);
