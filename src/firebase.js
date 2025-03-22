import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCPoYgmU2w-843XNTXFIknG2O8B-cvlbzs",
  authDomain: "nexusai-e657b.firebaseapp.com",
  projectId: "nexusai-e657b",
  storageBucket: "nexusai-e657b.firebasestorage.app",
  messagingSenderId: "817248313019",
  appId: "1:817248313019:web:d6fb8e4ad529b28d5d139e",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
