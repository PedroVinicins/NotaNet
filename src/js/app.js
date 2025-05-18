import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDatabase, ref, push, onValue, set } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

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
const database = getDatabase(app);

const btnNotes = document.getElementById('btnNotes');
const listnotas = document.getElementById('listnotas');
const notas = document.getElementById('notes-container');
const apagaTudoBtn = document.querySelector('.apagaTudo');
const btnSaveToFirebase = document.getElementById('btnSaveToFirebase');
const searchNotas = document.getElementById('searchNotas');
const btnGerarPDF = document.getElementById('btnGerarPDF');
const btnLogout = document.getElementById('btnLogout');


let savedData = JSON.parse(localStorage.getItem('notasData')) || [];
let currentIndex = 0;

// Função para criar um elemento de nota na lista lateral
function createNoteElement(item, index) {
    const noteItem = document.createElement('div');
    noteItem.classList.add('suasNotasSalvas');
    noteItem.innerHTML = `
        <div class="notasSalvas">
            <h1 contenteditable="true" class="note-name">${item.name}</h1>
            <p class="note-date">${item.date}</p>
        </div>
    `;

    const noteName = noteItem.querySelector('.note-name');
    const maxLength = 43;
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('error-message');
    noteItem.appendChild(messageContainer);

    
    noteName.addEventListener('input', () => {
        if (noteName.textContent.length >= maxLength) {
            noteName.textContent = noteName.textContent.substring(0, maxLength);
            messageContainer.textContent = 'Limite de caracteres atingido!';
            noteName.setAttribute('contenteditable', 'false');
        } else {
            messageContainer.textContent = '';
            noteName.setAttribute('contenteditable', 'true');
        }
        item.name = noteName.textContent;
        updateLocalStorage();
    });

    // Atualiza o conteúdo da nota ao clicar
    noteItem.addEventListener('click', () => handleNoteClick(index));

    return noteItem;
}

// Função para criar o conteúdo editável da nota
function createNoteContent(item) {
    const noteContainer = document.createElement('div');
    noteContainer.classList.add('container');
    noteContainer.innerHTML = `
        <div class="note-content">
            <h2 contenteditable="true" class="note-title">${item.name}</h2>
            <textarea placeholder="Escreva sua nota aqui...">${item.content || ''}</textarea>
        </div>
    `;

    const noteContentElement = noteContainer.querySelector('textarea');
    noteContentElement.addEventListener('input', () => {
        item.content = noteContentElement.value;
        updateLocalStorage();
    });

    return noteContainer;
}

// Função para pesquisar notasS
function pesquisarNotas() {
    const searchValue = searchNotas.value.toLowerCase();
    const noteItems = document.querySelectorAll('.suasNotasSalvas');
    const noteContents = document.querySelectorAll('.note-content');

    noteItems.forEach((note, index) => {
        const noteName = note.querySelector('.note-name').textContent.toLowerCase();
        if (noteName.includes(searchValue)) {
            note.style.display = '';
            noteContents[index].style.display = '';
        } else {
            note.style.display = 'none';
            noteContents[index].style.display = 'none';
        }
    });
}


function updateLocalStorage() {
    localStorage.setItem('notasData', JSON.stringify(savedData));
}

// Função para gerar PDF da nota
function gerarPDF() {
    const notasData = localStorage.getItem('notasData');

    // Verifica se há notas no localStorage
    if (!notasData) {
        alert('Nenhuma nota encontrada no localStoragee!');
        return;
    }

    // Converte a string JSON para um array de objetos
    const notas = JSON.parse(notasData);

    // Cria um novo documento PDF
    const doc = new window.jspdf.jsPDF();

    // Adiciona um título ao PDF
    doc.setFontSize(18);
    doc.text('Suas Notas', 10, 10);

    // Adiciona o conteúdo das notas ao PDF
    let yPos = 20; 
    doc.setFontSize(12);

    notas.forEach((nota, index) => {
        doc.text(`Nota ${index + 1}: ${nota.name}`, 10, yPos);
        yPos += 10;
        doc.text(`Data: ${nota.date}`, 10, yPos);
        yPos += 10;
        doc.text(`Conteúdo: ${nota.content}`, 10, yPos);
        yPos += 20; // Espaço entre as notas
    });

    // Salva o PDF com um nome específico
    doc.save('Suas_Notas.pdf');
}

// Função para rolar para a próxima nota
function descerScroll() {
    const sections = document.querySelectorAll('.note-content');
    if (currentIndex < sections.length - 1) {
        currentIndex++;
        sections[currentIndex].scrollIntoView({ behavior: "smooth" });
    } else {
        alert("Você já está na última nota!");
    }
}

// Função para lidar com o clique em uma nota lateral
function handleNoteClick(index) {
    const sections = document.querySelectorAll('.note-content');
    if (index >= 0 && index < sections.length) {
        currentIndex = index;
        sections[currentIndex].scrollIntoView({ behavior: "smooth" });
    }
}

// Função para renderizar as notas na tela
function renderData() {
    listnotas.innerHTML = "";
    notas.innerHTML = "";

    savedData.forEach((item, index) => {
        const noteItem = createNoteElement(item, index);
        listnotas.appendChild(noteItem);

        const noteContent = createNoteContent(item);
        notas.appendChild(noteContent);
    });

    currentIndex = 0;
}

// Função para adicionar uma nova notaa
function addNewNote() {
    const noteName = prompt("Digite o nome da sua nova nota:", "Nova Nota");
    if (noteName === null) return;

    const newNote = {
        name: noteName || "Nova Nota",
        date: new Date().toLocaleDateString(),
        content: ''
    };

    savedData.push(newNote);
    updateLocalStorage();
    renderData();
}

// Função para apagar todas as notassss
function apagarTudo() {
    const confirmDelete = confirm("Tem certeza de que deseja apagar tudo?");
    if (confirmDelete) {
        savedData = [];
        updateLocalStorage();
        renderData();
    }
}

// Função para salvar notas no Firebase
async function saveToFirebase() {
    const user = auth.currentUser;
    if (!user) {
        alert('Você precisa estar logado para salvar notas no Firebase.');
        return;
    }

    const notesRef = ref(database, `users/${user.uid}/notas`);
    try {
        savedData.forEach(async (note) => {
            const newNoteRef = push(notesRef);
            await set(newNoteRef, {
                id: newNoteRef.key, 
                name: note.name,
                content: note.content,
                date: note.date
            });
        });
        alert('Notas salvas no Firebase com sucesso!');
    } catch (error) {
        console.error('Erro ao salvar no Firebase:', error);
        alert('Erro ao salvar no Firebase.');
    }
}

function loadFromFirebase() {
    const user = auth.currentUser;
    if (!user) return;

    const notesRef = ref(database, `users/${user.uid}/notas`);
    onValue(notesRef, (snapshot) => {
        if (snapshot.exists()) {
            savedData = Object.values(snapshot.val());
        } else {
            savedData = [];
        }
        updateLocalStorage();
        renderData();
    });
}

function handleLogout() {
    signOut(auth)
        .then(() => {
            alert('Logout realizado com sucesso!');
            window.location.href = "index.html"; 
        })
        .catch((error) => {
            console.error('Erro ao fazer logout:', error);
        });
}

btnNotes.addEventListener('click', addNewNote);
apagaTudoBtn.addEventListener('click', apagarTudo);
btnSaveToFirebase.addEventListener('click', saveToFirebase);
searchNotas.addEventListener('input', pesquisarNotas);
btnGerarPDF.addEventListener('click', gerarPDF);
btnLogout.addEventListener('click', handleLogout);


onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "index.html";
    } else {
        loadFromFirebase();
    }
});

renderData();