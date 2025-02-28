import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBaz-T1o0EutMFxKWl8K8EbgWSV3A9U1aA",
  authDomain: "notanet-34cad.firebaseapp.com",
  projectId: "notanet-34cad",
  storageBucket: "notanet-34cad.appspot.com",
  messagingSenderId: "158464923311",
  appId: "1:158464923311:web:431bee0f905d0a8334265a",
  measurementId: "G-P4B2CH837M"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Exporta o objeto auth
export { auth };