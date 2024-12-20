const addFolderBtn = document.getElementById('addFolderBtn');
const sidebar = document.getElementById('sidebar');
const listnotas = document.getElementById('listnotas');
const notas = document.getElementById('notes-container');
const apagaTudoBtn = document.querySelector('.apagaTudo');

let savedData = JSON.parse(localStorage.getItem('notasData')) || [];
let currentIndex = 0;   

// Função para criar a pasta
function createFolderElement(sectionTitle) {
    const folderItem = document.createElement('div');
    folderItem.classList.add('folder');
    folderItem.innerHTML = `
        <i class='bx bx-folder'></i>
        <h1 contenteditable="true" class="note-nameF">${sectionTitle}</h1>
    `;
    return folderItem;
}

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
    return noteItem;
}

// Função para criar uma nota com conteúdo editável e checkbox
function createNoteContent(item) {
    const noteContainer = document.createElement('div');
    noteContainer.classList.add('container');
    noteContainer.innerHTML = `
      <div class="note-content">
          <h2 contenteditable="true" class="note-title">${item.name}</h2>
          <textarea placeholder="Escreva sua nota aqui...">${item.content || ''}</textarea>
      </div>
    `;
    return noteContainer;
}


// Função principal: adicionar uma nova pasta
function addFolder(sectionTitle = "Nova Pasta") {
    const noteData = { name: sectionTitle, date: new Date().toLocaleString(), content: "" };

    savedData.push(noteData);
    updateLocalStorage();
    renderData();
}

// Salva no LocalStorage
function updateLocalStorage() {
    localStorage.setItem('notasData', JSON.stringify(savedData));
}

document.addEventListener('input', (event) => {
    const element = event.target;

    if (element.classList.contains('note-name') || element.classList.contains('note-title')) {
        const index = [...document.querySelectorAll('.note-name, .note-title')].indexOf(element);
        if (index >= 0 && index < savedData.length) {
            savedData[index].name = element.innerText.trim();
            updateLocalStorage();
        }
    }

    if (element.tagName === 'TEXTAREA') {
        const index = [...document.querySelectorAll('textarea')].indexOf(element);
        if (index >= 0 && index < savedData.length) {
            savedData[index].content = element.value.trim();
            updateLocalStorage();
        }
    }
});


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
    sidebar.innerHTML = "";
    listnotas.innerHTML = "";
    notas.innerHTML = "";

    savedData.forEach((item, index) => {
        const folder = createFolderElement(item.name);
        sidebar.appendChild(folder);

        const noteItem = createNoteElement(item);
        listnotas.appendChild(noteItem);

        const noteContent = createNoteContent(item, index);
        notas.appendChild(noteContent);

        // Adiciona evento para cada nota lateral
        noteItem.addEventListener('click', () => handleNoteClick(index));
    });

    currentIndex = 0; // Reinicia o índice
}

// Evento: Adicionar pasta
addFolderBtn.addEventListener('click', () => {
    const folderName = prompt("Digite o nome da nova pasta:");
    if (folderName && folderName.trim()) {
        addFolder(folderName.trim());
    } else {
        alert("Nome da pasta inválido.");
    }
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
