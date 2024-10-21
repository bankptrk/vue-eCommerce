// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAGKlfn64H2aoMXccnBfnil8KnEcpLH68Q',
  authDomain: 'ez-commerce-ptrk.firebaseapp.com',
  databaseURL:
    'https://ez-commerce-ptrk-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'ez-commerce-ptrk',
  storageBucket: 'ez-commerce-ptrk.appspot.com',
  messagingSenderId: '696688960630',
  appId: '1:696688960630:web:a72960854400baeed36b57',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
connectFirestoreEmulator(db, '127.0.0.1', 8080);

const auth = getAuth(app);
connectAuthEmulator(auth, 'http://127.0.0.1:9099');

const storage = getStorage();
connectStorageEmulator(storage, '127.0.0.1', 9199);

export { db, auth, storage };
