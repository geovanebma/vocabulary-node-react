// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, get, update, child, query, orderByKey, limitToFirst, startAt } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "",
  authDomain: "dictionary-29edb.firebaseapp.com",
  projectId: "dictionary-29edb",
  storageBucket: "dictionary-29edb.firebasestorage.app",
  messagingSenderId: "920079489313",
  appId: "1:920079489313:web:155dcc64947612a770c660",
  measurementId: "G-40445XKVR4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

export { database, ref, get, update, child, query, orderByKey, limitToFirst, startAt };