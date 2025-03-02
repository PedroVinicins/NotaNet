import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBaz-T1o0EutMFxKWl8K8EbgWSV3A9U1aA",
    authDomain: "notanet-34cad.firebaseapp.com",
    databaseURL: "https://notanet-34cad-default-rtdb.firebaseio.com",
    projectId: "notanet-34cad",
    storageBucket: "notanet-34cad.firebasestorage.app",
    messagingSenderId: "158464923311",
    appId: "1:158464923311:web:431bee0f905d0a8334265a",
    measurementId: "G-P4B2CH837M"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  
  export { auth, db };