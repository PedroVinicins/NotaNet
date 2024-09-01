const content = document.querySelector(".content");
const btnNew = document.querySelector(".addNote-content");
const noteAl = document.querySelector(".noteAl");
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

let items_db = JSON.parse(localStorage.getItem("items_db")) || [];
const colors = {
  default: "coral",
  noteAl: "#222",
};

// Função para gerar cores aleatórias (opcional)
const randomColor = () => {
  const availableColors = ["#222"];
  return availableColors[Math.floor(Math.random() * availableColors.length)];
};

function loadItems() {
  content.innerHTML = "";
  verifyNulls();

  items_db.forEach((item, i) => {
    if (item.type === "Alert") {
      addAlertHTML(item, i);
    } else {
      addHTML(item, i);
    }
  });
}

btnNew.onclick = () => {
  addNewItem();
};

noteAl.onclick = () => {
  addNewAlert(colors.noteAl);
};

function addNewItem(color = randomColor()) {
  const newItem = {
    text: "",
    color: color,
    type: "Note",
  };
  items_db.push(newItem);
  updateLocalStorage();
  loadItems();
}

function addNewAlert(color) {
  const newItem = {
    text: "",
    color: color,
    type: "Alert",
  };
  items_db.unshift(newItem);
  updateLocalStorage();
  loadItems();
}

function updateLocalStorage() {
  localStorage.setItem("items_db", JSON.stringify(items_db));
}

// Função para criar HTML para uma nota
function addHTML(item, index) {
  const div = document.createElement("div");
  div.classList.add("item");
  div.style.backgroundColor = item.color;
  div.setAttribute("data-index", index);

  div.innerHTML = `
  <span class="remove"><i class='bx bx-brush-alt bx-tada' style='color:#ffff'></i></span>
  <textarea placeholder="Sua Tarefa" class="noteAl">${item.text}</textarea>
     `;
  content.appendChild(div);
}

// Função para criar HTML para um alerta
function addAlertHTML(item, index) {
  const div = document.createElement("div");
  div.classList.add("Alert");
  div.style.backgroundColor = item.color;
  div.setAttribute("data-index", index);

  div.innerHTML = `
    <span class="remove"><i class='bx bx-x'></i></span>
    <textarea placeholder="Tarefa de alta prioridade" class="Alertsy">${item.text}</textarea>
  `;

  content.appendChild(div);
}

// Função para adicionar eventos usando delegação de eventos
function addEvents() {
  // Evento para capturar cliques nos botões de remoção
  content.addEventListener("click", (e) => {
    if (e.target.closest(".remove")) {
      const parent = e.target.closest("[data-index]");
      const index = parseInt(parent.getAttribute("data-index"));
      removeItem(index);
    }
  });

  // Evento para capturar alterações nos textareas
  content.addEventListener("input", (e) => {
    if (e.target.tagName.toLowerCase() === "textarea") {
      const parent = e.target.closest("[data-index]");
      const index = parseInt(parent.getAttribute("data-index"));
      updateItemText(index, e.target.value);
    }
  });
}

function removeItem(index) {
  items_db.splice(index, 1);
  updateLocalStorage();
  loadItems();
}

function updateItemText(index, newText) {
  if (items_db[index]) {
    items_db[index].text = newText;
    updateLocalStorage();
  }
}

function verifyNulls() {
  items_db = items_db.filter((item) => item !== null && item !== undefined);
  updateLocalStorage();
}

// Verificação do tema dark
if (localStorage.getItem('dark-theme') === 'true') {
  body.classList.add('dark-theme');
}

themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-theme');
  
  // Salvar a preferência do usuário no localStorage
  localStorage.setItem('dark-theme', body.classList.contains('dark-theme'));
});

addEvents();
loadItems();
