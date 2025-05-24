
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAPoylZV_uJc_MDc4bDFaGKL46VVGfui4M",
  authDomain: "schoolrship-132e8.firebaseapp.com",
  projectId: "schoolrship-132e8",
  storageBucket: "schoolrship-132e8.firebasestorage.app",
  messagingSenderId: "858023893343",
  appId: "1:858023893343:web:beeba9545d9a4d8d7b7eea",
  measurementId: "G-MRPRTGC09B"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
