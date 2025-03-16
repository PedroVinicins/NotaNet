import { auth, db } from './config.js';
import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword // Adicionando a função de login
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { 
    collection, 
    addDoc, 
    query, 
    getDocs 
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Elementos do DOM
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const listnotas = document.getElementById('listnotas');
const notas = document.getElementById('notes-container');
const btnRegister = document.getElementById('btnRegister');
const btnLogin = document.getElementById('btnLogin'); // Botão de login
const loader = document.getElementById('loader'); // Elemento para animação de carregamento

// Variáveis globais
let savedData = []; // Armazena as notas carregadas
let currentIndex = 0; // Índice da nota atual

// Evento de registro de usuário
btnRegister.addEventListener('click', async () => {
    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();

    if (!email || !password) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('Usuário registrado:', userCredential.user);

        if (userCredential.user) {
            const userData = {
                uid: userCredential.user.uid,
                email,
                createdAt: new Date()
            };
            
            const docRef = await addDoc(collection(db, "users"), userData);
            console.log("Documento salvo com ID: ", docRef.id);

            localStorage.setItem('user', JSON.stringify({ uid: userCredential.user.uid, email }));
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Erro ao registrar:', error);
        alert(error.code === 'auth/email-already-in-use' ? 'Este email já está em uso.' : 'Erro ao registrar: ' + error.message);
    }
});

// Evento de login de usuário
btnLogin.addEventListener('click', async () => {
    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();

    if (!email || !password) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('Usuário logado:', userCredential.user);

        if (userCredential.user) {
            localStorage.setItem('user', JSON.stringify({ uid: userCredential.user.uid, email }));
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert('Erro ao fazer login: ' + error.message);
    }
});

// Exibe o loader
function showLoader() {
    loader.style.display = 'block';
}

// Esconde o loader
function hideLoader() {
    loader.style.display = 'none';
}

// Função para carregar notas do Firestore
async function loadFromFirebase() {
    const user = auth.currentUser;

    if (!user) {
        alert('Usuário não autenticado. Faça login para carregar notas.');
        return;
    }

    showLoader(); // Inicia o carregamento
    const userId = user.uid;
    const notasRef = collection(db, 'users', userId, 'notas');
    const q = query(notasRef);

    try {
        const querySnapshot = await getDocs(q);
        savedData = querySnapshot.docs.map(doc => doc.data());
        renderData();
    } catch (error) {
        console.error('Erro ao carregar notas:', error);
        alert('Erro ao carregar notas. Verifique o console para mais detalhes.');
    } finally {
        hideLoader(); // Finaliza o carregamento
    }
}

// Função para renderizar as notas na tela
function renderData() {
    listnotas.innerHTML = "";
    notas.innerHTML = "";

    savedData.forEach((item, index) => {
        const noteItem = document.createElement('div');
        noteItem.textContent = item.name;
        noteItem.classList.add('note-item');
        noteItem.addEventListener('click', () => {
            currentIndex = index;
            renderNoteContent();
        });
        listnotas.appendChild(noteItem);
    });
    
    if (savedData.length > 0) {
        renderNoteContent();
    }
}

// Função para renderizar o conteúdo da nota selecionada
function renderNoteContent() {
    notas.innerHTML = "";
    if (savedData[currentIndex]) {
        const noteContent = document.createElement('div');
        noteContent.textContent = savedData[currentIndex].content;
        noteContent.classList.add('note-content');
        notas.appendChild(noteContent);
    }
}

// Inicialização: Verifica se o usuário está logado ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        loadFromFirebase();
    }
});