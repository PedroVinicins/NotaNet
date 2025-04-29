import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDatabase, ref, push, onValue, set , remove} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Configuração do Firebase
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
const database = getDatabase(app);

// Elementos do DOM
const btnNotes = document.getElementById('btnNotes');
const listnotas = document.getElementById('listnotas');
const notas = document.getElementById('notes-container');
const apagaTudoBtn = document.querySelector('.apagaTudo');
const btnSaveToFirebase = document.getElementById('btnSaveToFirebase');
const searchNotas = document.getElementById('searchNotas');
const btnGerarPDF = document.getElementById('btnGerarPDF');
const btnLogout = document.getElementById('btnLogout');

// Dados salvos no localStorage
let savedData = JSON.parse(localStorage.getItem('notasData')) || [];
let currentIndex = 0;

// Função para criar um elemento de nota na lista lateral
function createNoteElement(item, index) {
    const noteItem = document.createElement('div');
    noteItem.classList.add('suasNotasSalvas');
    noteItem.innerHTML = `
        <div class="notasSalvas">
            <span class="apagarNota" data-index="${index}">X</span>
            <h1 contenteditable="true" class="note-name">${item.name}</h1>
            <p class="note-date">${item.date}</p>
        </div>
    `;

    const noteName = noteItem.querySelector('.note-name');
    const maxLength = 43;
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('error-message');
    noteItem.appendChild(messageContainer);

    // Limita o número de caracteres no nome da nota
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

    // Adiciona evento de clique para apagar nota
    noteItem.querySelector('.apagarNota').addEventListener('click', (e) => {
        e.stopPropagation();
        apagarNotaFirebase(index);
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

    const noteTitle = noteContainer.querySelector('.note-title');
    const noteContentElement = noteContainer.querySelector('textarea');
    
    // Atualiza o título da nota
    noteTitle.addEventListener('input', () => {
        item.name = noteTitle.textContent;
        // Atualiza também o nome na lista lateral
        const noteNameElements = document.querySelectorAll('.note-name');
        if (noteNameElements[index]) {
            noteNameElements[index].textContent = noteTitle.textContent;
        }
        updateLocalStorage();
    });

    // Atualiza o conteúdo da nota
    noteContentElement.addEventListener('input', () => {
        item.content = noteContentElement.value;
        updateLocalStorage();
    });

    return noteContainer;
}

// Função para pesquisar notas
function handleSearch() {
    const searchValue = searchNotas.value.toLowerCase();
    const noteItems = document.querySelectorAll('.suasNotasSalvas');
    const noteContents = document.querySelectorAll('.note-content');

    noteItems.forEach((note, index) => {
        const noteName = note.querySelector('.note-name').textContent.toLowerCase();
        if (noteName.includes(searchValue)) {
            note.style.display = '';
            if (noteContents[index]) {
                noteContents[index].style.display = '';
            }
        } else {
            note.style.display = 'none';
            if (noteContents[index]) {
                noteContents[index].style.display = 'none';
            }
        }
    });
}

// Função para atualizar o localStorage
function updateLocalStorage() {
    localStorage.setItem('notasData', JSON.stringify(savedData));
}

// Função para gerar PDF da nota
async function gerarPDF() {
    try {
        // Carrega a biblioteca jsPDF dinamicamente
        const { jsPDF } = await import('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
        
        const notasData = JSON.parse(localStorage.getItem('notasData')) || [];

        if (notasData.length === 0) {
            alert('Nenhuma nota encontrada!');
            return;
        }

        // Cria um novo documento PDF
        const doc = new jsPDF();

        // Adiciona um título ao PDF
        doc.setFontSize(18);
        doc.text('Suas Notas', 10, 10);

        // Adiciona o conteúdo das notas ao PDF
        let yPos = 20;
        doc.setFontSize(12);

        notasData.forEach((nota, index) => {
            // Quebra o texto em linhas para evitar overflow
            const lines = doc.splitTextToSize(nota.content, 180);
            
            doc.text(`Nota ${index + 1}: ${nota.name}`, 10, yPos);
            yPos += 7;
            doc.text(`Data: ${nota.date}`, 10, yPos);
            yPos += 7;
            doc.text('Conteúdo:', 10, yPos);
            yPos += 7;
            doc.text(lines, 10, yPos);
            yPos += (lines.length * 7) + 10; // Espaço entre as notas
            
            // Adiciona nova página se necessário
            if (yPos > 280 && index < notasData.length - 1) {
                doc.addPage();
                yPos = 20;
            }
        });

        // Salva o PDF
        doc.save('Suas_Notas.pdf');
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        alert('Erro ao gerar PDF. Por favor, tente novamente.');
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

// Função para adicionar uma nova nota
function addNewNote() {
    const noteName = prompt("Digite o nome da sua nova nota:", "Nova Nota");
    if (noteName === null || noteName.trim() === "") return;

    const newNote = {
        id: Date.now().toString(), // Adiciona um ID único
        name: noteName.trim() || "Nova Nota",
        date: new Date().toLocaleDateString(),
        content: ''
    };

    savedData.push(newNote);
    updateLocalStorage();
    renderData();
}

// Função para apagar todas as notas
async function apagarTudo() {
    const user = auth.currentUser;
    if (!user) {
        alert('Você precisa estar logado para apagar as notas.');
        return;
    }

    const confirmDelete = confirm("Tem certeza de que deseja apagar todas as notas? Esta ação não pode ser desfeita.");
    if (confirmDelete) {
        try {
            // Apaga do Firebase
            if (user) {
                const notesRef = ref(database, `users/${user.uid}/notas`);
                await remove(notesRef);
            }
            
            // Apaga localmente
            savedData = [];
            updateLocalStorage();
            renderData();
            alert('Todas as notas foram apagadas com sucesso!');
        } catch (error) {
            console.error('Erro ao apagar as notas:', error);
            alert('Ocorreu um erro ao apagar as notas. Por favor, tente novamente.');
        }
    }
}

// Função para apagar uma nota específica
async function apagarNotaFirebase(index) {
    const user = auth.currentUser;
    const note = savedData[index];
    
    if (!note) return;

    const confirmDelete = confirm(`Tem certeza de que deseja apagar a nota "${note.name}"?`);
    if (!confirmDelete) return;

    try {
        // Apaga do Firebase se estiver logado
        if (user && note.id) {
            const noteRef = ref(database, `users/${user.uid}/notas/${note.id}`);
            await remove(noteRef);
        }
        
        // Apaga localmente
        savedData.splice(index, 1);
        updateLocalStorage();
        renderData();
        alert('Nota apagada com sucesso!');
    } catch (error) {
        console.error('Erro ao apagar a nota:', error);
        alert('Ocorreu um erro ao apagar a nota. Por favor, tente novamente.');
    }
}

// Função para salvar notas no Firebase
async function saveToFirebase() {
    const user = auth.currentUser;
    if (!user) {
        alert('Você precisa estar logado para salvar notas no Firebase.');
        return;
    }

    try {
        const notesRef = ref(database, `users/${user.uid}/notas`);
        
        // Primeiro remove todas as notas existentes
        await remove(notesRef);
        
        // Depois salva as novas notas
        const promises = savedData.map(async (note) => {
            const newNoteRef = push(notesRef);
            await set(newNoteRef, {
                id: newNoteRef.key,
                name: note.name,
                content: note.content,
                date: note.date
            });
            return newNoteRef.key;
        });

        await Promise.all(promises);
        alert('Notas salvas no Firebase com sucesso!');
    } catch (error) {
        console.error('Erro ao salvar no Firebase:', error);
        alert('Erro ao salvar no Firebase. Por favor, tente novamente.');
    }
}

// Função para carregar notas do Firebase
function loadFromFirebase() {
    const user = auth.currentUser;
    if (!user) return;

    const notesRef = ref(database, `users/${user.uid}/notas`);
    onValue(notesRef, (snapshot) => {
        const firebaseData = snapshot.val();
        if (firebaseData) {
            // Converte o objeto do Firebase em array
            savedData = Object.keys(firebaseData).map(key => ({
                id: key,
                ...firebaseData[key]
            }));
        } else {
            savedData = [];
        }
        updateLocalStorage();
        renderData();
    }, (error) => {
        console.error('Erro ao carregar do Firebase:', error);
    });
}

// Função para logout
function handleLogout() {
    signOut(auth)
        .then(() => {
            alert('Logout realizado com sucesso!');
            window.location.href = "index.html"; 
        })
        .catch((error) => {
            console.error('Erro ao fazer logout:', error);
            alert('Erro ao fazer logout. Por favor, tente novamente.');
        });
}

// Event Listeners
btnNotes.addEventListener('click', addNewNote);
apagaTudoBtn.addEventListener('click', apagarTudo);
btnSaveToFirebase.addEventListener('click', saveToFirebase);
searchNotas.addEventListener('input', handleSearch);
btnGerarPDF.addEventListener('click', gerarPDF);
btnLogout.addEventListener('click', handleLogout);

// Verifica se o usuário está logado e carrega as notas
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "index.html";
    } else {
        loadFromFirebase();
    }
});

// Inicializa a aplicação
renderData();