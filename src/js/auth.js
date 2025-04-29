

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

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

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const authStatus = document.getElementById('auth-status');

// Função para login
loginBtn.addEventListener('click', () => {
    const email = loginEmail.value;
    const password = loginPassword.value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            authStatus.textContent = `Logado como: ${userCredential.user.email}`;
            // rota de redirecionamento após login
            window.location.href = "NotaNet.html";
        })
        .catch((error) => {
            authStatus.textContent = `Erro ao logar: ${error.message}`;
        });
});

// Função para cadastro
registerBtn.addEventListener('click', () => {
    const email = loginEmail.value;
    const password = loginPassword.value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            authStatus.textContent = `Usuário cadastrado: ${userCredential.user.email}`;
        })
        .catch((error) => {
            authStatus.textContent = `Erro ao cadastrar: ${error.message}`;
        });
});