// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBaz-T1o0EutMFxKWl8K8EbgWSV3A9U1aA",
  authDomain: "notanet-34cad.firebaseapp.com",
  projectId: "notanet-34cad",
  storageBucket: "notanet-34cad.firebasestorage.app",
  messagingSenderId: "158464923311",
  appId: "1:158464923311:web:431bee0f905d0a8334265a",
  measurementId: "G-P4B2CH837M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);