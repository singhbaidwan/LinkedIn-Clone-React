import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { getStorage } from "firebase/storage";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD7iJlH2_K6Fzx9v6Izwzxh6G8LcxMkrAU",
  authDomain: "linkedin-clone-914a3.firebaseapp.com",
  projectId: "linkedin-clone-914a3",
  storageBucket: "linkedin-clone-914a3.appspot.com",
  messagingSenderId: "733988883737",
  appId: "1:733988883737:web:6ab163e71c72b5ffa08988",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const storage = getStorage(firebaseApp);

export { auth, provider, storage, signInWithPopup };
export default db;
