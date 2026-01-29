import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore }  from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCbbUi3EEvSkT2LkrC0H0mV2TLinnLq7Ak",
  authDomain: "kula-app-e08e7.firebaseapp.com",
  projectId: "kula-app-e08e7",
  storageBucket: "kula-app-e08e7.firebasestorage.app",
  messagingSenderId: "121069297301",
  appId: "1:121069297301:web:88aae625c4b79a5d48059c",
  measurementId: "G-3YBY928YYE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
