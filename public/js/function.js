const addFolderBtn = document.getElementById('addFolderBtn');
const sidebar = document.getElementById('sidebar');
const listnotas = document.getElementById('listnotas');
const notas = document.getElementById('notes-container');
const apagaTudoBtn = document.querySelector('.apagaTudo');
const addCheckboxLineBtn = document.getElementById('addCheckboxLineBtn');

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
function createNoteContent(item, index) {
    const noteContainer = document.createElement('div');
    noteContainer.classList.add('container');
    noteContainer.innerHTML = `
      <div class="note-content">
          <h2 contenteditable="true" class="note-title">${item.name}</h2>
          <div id="editable${index}" class="note-body">${item.content || ''}</div>
          <button class="add-checkbox-line" data-index="${index}">Adicionar Checkbox</button>
      </div>
    `;

    const noteBody = noteContainer.querySelector('.note-body');
    const addCheckboxBtn = noteContainer.querySelector('.add-checkbox-line');

    // Evento para salvar o conteúdo editável
    noteBody.addEventListener('input', () => {
        savedData[index].content = noteBody.innerHTML; // Salva o HTML da nota
        updateLocalStorage();
    });

    // Evento para adicionar uma linha com checkbox
    addCheckboxBtn.addEventListener('click', (event) => {
        const index = event.target.dataset.index;
        addCheckboxLine(index);
    });

    return noteContainer;
}

// Função para adicionar linha com checkbox
function addCheckboxLine(index) {
    const editableDiv = document.getElementById(`editable${index}`);
    const line = document.createElement('div');
    line.className = 'line';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    
    const textNode = document.createElement('span');
    textNode.contentEditable = true;
    textNode.textContent = 'Digite aqui...';
    
    line.appendChild(checkbox);
    line.appendChild(textNode);
    editableDiv.appendChild(line);
    
    // Atualiza o estado da checkbox ao marcar/desmarcar
    checkbox.addEventListener('change', () => {
        savedData[index].content = editableDiv.innerHTML; // Atualiza o conteúdo
        updateLocalStorage();
    });
    
    textNode.focus();
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
