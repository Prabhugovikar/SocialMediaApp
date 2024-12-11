import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {  auth, googleProvider } from "../../firebase"; // Ensure this is the correct path to your firebase.ts


export const googleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    const user = result.user;

    return {
        token,
        username: user.displayName,
        Email: user.email,
        profileimage: user.photoURL,
        bannerimage: '',
        Bio: ''
      };
  } catch (error) {
    console.error("Error during Google login", error);
    throw error;
  }
};
