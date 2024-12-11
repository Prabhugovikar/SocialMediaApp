import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCB4lnH8Re7ePLd_IYAkxLpAmmK9Eg9kPA",
    authDomain: "socialmedia-71205.firebaseapp.com",
    projectId: "socialmedia-71205",
    storageBucket: "socialmedia-71205.firebasestorage.app",
    messagingSenderId: "221345019369",
    appId: "1:221345019369:web:97b7d9faf1409c1cf44778",
    measurementId: "G-QY2GVYCJHN"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
