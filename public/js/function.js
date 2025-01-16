const btnNotes = document.getElementById('btnNotes');
const listnotas = document.getElementById('listnotas');
const notas = document.getElementById('notes-container');
const apagaTudoBtn = document.querySelector('.apagaTudo');

let savedData = JSON.parse(localStorage.getItem('notasData')) || [];
let currentIndex = 0;

// Função para criar uma nota na lista lateral
function createNoteElement(item) {
    const noteItem = document.createElement('div');
    noteItem.classList.add('suasNotasSalvas');
    noteItem.innerHTML = `
        <div class="notasSalvas">
            <h1 contenteditable="true" class="note-name">${item.name}</h1>
            <p class="note-date">${item.date}</p>
        </div>
    `;

    const noteName = noteItem.querySelector('.note-name'); 
    noteName.addEventListener('input', function () { 
        if (noteName.textContent.length > 19) { 
            noteName.textContent = noteName.textContent.substring(0, 19); 
        } 
    });

    const noteNameElement = noteItem.querySelector('.note-name');
    noteNameElement.addEventListener('input', () => {
        // Atualiza o título editável no conteúdo da nota quando o nome da nota mudar
        const noteContentElement = document.querySelector('.note-title');
        noteContentElement.innerText = noteNameElement.innerText;
        item.name = noteNameElement.innerText;
        updateLocalStorage();
    });

    return noteItem;
}

// Função para criar uma nota com conteúdo editável
function createNoteContent(item) {
    const noteContainer = document.createElement('div');
    noteContainer.classList.add('container');
    noteContainer.innerHTML = `
        <div class="note-content">
            <h2 contenteditable="true" class="note-title">${item.name}</h2>
            <textarea placeholder="Escreva sua nota aqui...">${item.content || ''}</textarea>
        </div>
    `;

    const noteTitleElement = noteContainer.querySelector('.note-title');
    noteTitleElement.addEventListener('input', () => {
        // Atualiza o título editável no elemento da nota quando o conteúdo mudar
        const noteNameElement = document.querySelector('.note-name');
        noteNameElement.innerText = noteTitleElement.innerText;
        item.name = noteTitleElement.innerText;
        updateLocalStorage();
    });

    const noteContentElement = noteContainer.querySelector('textarea');
    noteContentElement.addEventListener('input', () => {
        item.content = noteContentElement.value;
        updateLocalStorage();
    });

    return noteContainer;
}

// Pesquisa de notas
document.getElementById('searchNotas').addEventListener('input', function() {
    const searchValue = this.value.toLowerCase();
    const noteItems = document.querySelectorAll('.suasNotasSalvas');
    const noteContents = document.querySelectorAll('.note-content');
    
    // Filtra notas laterais
    noteItems.forEach(function(note) {
        const noteName = note.querySelector('.note-name').textContent.toLowerCase();
        if (noteName.includes(searchValue)) {
            note.style.display = ''; // Mostrar nota
        } else {
            note.style.display = 'none'; // Ocultar nota
        }
    });

    // Filtra conteúdos das notas
    noteContents.forEach(function(note) {
        const noteTitle = note.querySelector('.note-title').textContent.toLowerCase();
        if (noteTitle.includes(searchValue)) {
            note.style.display = ''; // Mostrar conteúdo
        } else {
            note.style.display = 'none'; // Ocultar conteúdo
        }
    });
});

// Salva no LocalStorage
function updateLocalStorage() {
    localStorage.setItem('notasData', JSON.stringify(savedData));
}

// Função para descer uma nota
function descerScroll() {
    const sections = document.querySelectorAll('.note-content');
    if (currentIndex < sections.length - 1) {
        currentIndex++;
        sections[currentIndex].scrollIntoView({ behavior: "smooth" });
    } else {
        alert("Você já está na última nota!");
    }
}

// Atualiza o índice ao clicar em uma nota lateral
function handleNoteClick(index) {
    const sections = document.querySelectorAll('.note-content');
    if (index >= 0 && index < sections.length) {
        currentIndex = index;
        sections[currentIndex].scrollIntoView({ behavior: "smooth" });
    }
}

// Renderiza os dados e adiciona eventos aos itens da lista lateral
function renderData() {
    listnotas.innerHTML = "";
    notas.innerHTML = "";

    savedData.forEach((item, index) => {
        const noteItem = createNoteElement(item);
        listnotas.appendChild(noteItem);

        const noteContent = createNoteContent(item);
        notas.appendChild(noteContent);

        // Adiciona evento para cada nota lateral
        noteItem.addEventListener('click', () => handleNoteClick(index));
    });

    currentIndex = 0; // Reinicia o índice
}

function addNewNote() {
    const noteName = prompt("Digite o nome da sua nova nota:", "Nova Nota");
    const newNote = {
        name: noteName || "Nova Nota", // Use the entered name, or default to "Nova Nota"
        date: new Date().toLocaleDateString(),
        content: ''
    };

    savedData.push(newNote);
    updateLocalStorage();
    renderData();
}

btnNotes.addEventListener('click', () => {
    addNewNote();
});

// Evento: Apagar tudo
apagaTudoBtn.addEventListener('click', () => {
    const confirmDelete = confirm("Tem certeza de que deseja apagar tudo?");
    if (confirmDelete) {
        savedData = [];
        updateLocalStorage();
        renderData();
    }
});

// Carrega os dados ao iniciar
renderData();
