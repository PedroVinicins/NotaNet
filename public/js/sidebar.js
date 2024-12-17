const addFolderBtn = document.getElementById('addFolderBtn');
const sidebar = document.getElementById('sidebar');
const listnotas = document.getElementById('listnotas');
const notas = document.getElementById('notes-container');
const apagaTudoBtn = document.querySelector('.apagaTudo');

function createFolderElement(sectionTitle) {
    const folderItem = document.createElement('div');
    folderItem.classList.add('folder');

    folderItem.innerHTML = `
        <i class='bx bx-folder'></i>
        <h1 contenteditable="true" class="note-nameF">${sectionTitle}</h1> 
    `;

    return folderItem;
}

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

function createNoteClass() {
    const notaclass = document.createElement('div');
    notaclass.classList.add('container'); 
    notaclass.innerHTML = `
      <div class="note-content">
          <h2 contenteditable="true" class="note-title">Nota de exemplo</h2>
          <textarea placeholder="Escreva sua nota aqui..."></textarea>
      </div>
    `;
    return notaclass;
}

function addFolder(sectionTitle = "Nova Pasta") {
    // Cria a pasta na sidebar
    const sidebarFolder = createFolderElement(sectionTitle);
    sidebar.appendChild(sidebarFolder);

    // Cria a nota na lista de notas
    const noteData = { name: sectionTitle, date: new Date().toLocaleString() };
    const listNote = createNoteElement(noteData);
    listnotas.appendChild(listNote);

    // Cria a nota com conteúdo editável e adiciona ao contêiner de notas
    const noteContent = createNoteClass();
    notas.appendChild(noteContent);
}

// Evento para o botão de adicionar pasta
addFolderBtn.addEventListener('click', () => {
    const folderName = prompt("Digite o nome da nova pasta:");
    if (folderName && folderName.trim()) {
        addFolder(folderName.trim());
    } else {
        alert("Nome da pasta inválido.");
    }
});

// Evento para apagar tudo
apagaTudoBtn.addEventListener('click', () => {
    const confirmDelete = confirm("Tem certeza de que deseja apagar tudo?");
    if (confirmDelete) {
        sidebar.innerHTML = ""; // Remove todas as pastas
        listnotas.innerHTML = ""; // Remove todas as notas
        notas.innerHTML = ""; // Remove todas as notas do contêiner
        location.reload(); // Atualiza a página
    }
});
