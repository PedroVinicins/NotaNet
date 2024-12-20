const addFolderBtn = document.getElementById('addFolderBtn');
const sidebar = document.getElementById('sidebar');
const listnotas = document.getElementById('listnotas');
const notas = document.getElementById('notes-container');
const apagaTudoBtn = document.querySelector('.apagaTudo');

let savedData = JSON.parse(localStorage.getItem('notasData')) || [];

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

// Função para criar uma nota com conteúdo editável
function createNoteContent(item, index) {
    const noteContainer = document.createElement('div');
    noteContainer.classList.add('container');
    noteContainer.innerHTML = `
      <div class="note-content">
          <h2 contenteditable="true" class="note-title">${item.name}</h2>
          <textarea placeholder="Escreva sua nota aqui...">${item.content || ''}</textarea>
      </div>
    `;

    // Adiciona evento para salvar o conteúdo do textarea
    const textarea = noteContainer.querySelector('textarea');
    textarea.addEventListener('input', () => {
        savedData[index].content = textarea.value; // Atualiza o conteúdo no array
        updateLocalStorage(); // Salva no LocalStorage
    });

    return noteContainer;
}

// Função principal: adicionar uma nova pasta
function addFolder(sectionTitle = "Nova Pasta") {
    const noteData = { name: sectionTitle, date: new Date().toLocaleString(), content: "" };

    savedData.push(noteData);
    updateLocalStorage();

    // Adiciona aos elementos visuais
    renderData();
}

// Salva no LocalStorage
function updateLocalStorage() {
    localStorage.setItem('notasData', JSON.stringify(savedData));
}

// Renderiza os dados
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
    });
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