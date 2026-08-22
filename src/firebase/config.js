import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD3n0pAc0BlKCB2P_Ycy09-zSQh6SZjAu0",
  authDomain: "dayflow-hrms-41604.firebaseapp.com",
  projectId: "dayflow-hrms-41604",
  storageBucket: "dayflow-hrms-41604.firebasestorage.app",
  messagingSenderId: "713838661904",
  appId: "1:713838661904:web:e6e2e47fcd7db266b71595"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;