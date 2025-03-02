import { auth, db } from './config.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const btnRegister = document.getElementById('btnRegister');

btnRegister.addEventListener('click', async () => {
    const email = loginEmail.value;
    const password = loginPassword.value;

    if (!email || !password) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('Usuário registrado:', userCredential.user);

        // Verifique se o usuário está autenticado
        if (userCredential.user) {
            const userData = {
                uid: userCredential.user.uid,
                email: email,
                createdAt: new Date()
            };

            const docRef = await addDoc(collection(db, "users"), userData);
            console.log("Documento salvo com ID: ", docRef.id);

            // Salvar informações do usuário no localStorage
            localStorage.setItem('user', JSON.stringify({
                uid: userCredential.user.uid,
                email: email
            }));

            // Redirecionar para index.html
            window.location.href = 'index.html';
        } else {
            console.error('Usuário não autenticado.');
            alert('Erro: Usuário não autenticado.');
        }
    } catch (error) {
        console.error('Erro ao registrar:', error);
        alert('Erro ao registrar: ' + error.message);
    }
});
