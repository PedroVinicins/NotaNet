

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Configuração do Firebase
const apikey = process.env.API_KEY;
const authDomain = process.env.AUTH_DOMAIN;
const databaseURL = process.env.DATABASE_URL;
const projectId = process.env.PROJECT_ID;
const storageBucket = process.env.STORAGE_BUCKET;
const messagingSenderId = process.env.MESSAGING_SENDER_ID;
const appId = process.env.APP_ID;
const measurementId = process.env.MEASUREMENT_ID;
const firebaseConfig = {
    apiKey: apikey,
    authDomain: authDomain,
    databaseURL: databaseURL,
    projectId: projectId,
    storageBucket: storageBucket,
    messagingSenderId: messagingSenderId,
    appId: appId,
    measurementId: measurementId
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