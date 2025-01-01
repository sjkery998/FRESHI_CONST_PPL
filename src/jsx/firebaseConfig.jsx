// src/jsx/firebaseConfig.jsx
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "freshi-const.firebaseapp.com",
    databaseURL: import.meta.env.VITE_DB_REF,
    projectId: "freshi-const",
    storageBucket: "freshi-const.appspot.com",
    messagingSenderId: "993914716911",
    appId: "1:993914716911:web:7b771bcc72f55f9326911a",
  };
  

// Inisialisasi Firebase App
const app = initializeApp(firebaseConfig);

export default app;
