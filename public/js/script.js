const content = document.querySelector(".content");
const btnNew = document.querySelector(".addNote-content");
const addNoteButton = document.querySelector('.addNote-content2');
const noteAl = document.querySelector(".noteAl");
const themeToggle = document.getElementById('theme-toggle');
const themeToggle2 = document.getElementById('theme-toggle1');
const body = document.body;

let items_db = JSON.parse(localStorage.getItem("items_db")) || [];
const colors = {
  default: "coral",
  noteAl: "#222 ",
};

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

// segundo btn 
addNoteButton.addEventListener('click', () => {
  addNewItem(); 
});

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
    date: new Date().toLocaleDateString('pt-BR'),
    level: 'media',
    name: 'Nova Nota'
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
    date: new Date().toLocaleDateString('pt-BR'),
    level: 'alta',
    name: ' Importante'
  };
  items_db.unshift(newItem);
  updateLocalStorage();
  loadItems();
}

function updateLocalStorage() {
  localStorage.setItem("items_db", JSON.stringify(items_db));
}

function addHTML(item, index) {
  const div = document.createElement("div");
  div.classList.add("item");
  div.style.backgroundColor = item.color;
  div.setAttribute("data-index", index);

  div.innerHTML = `
    <span class="remove"><i class='bx bx-brush-alt bx-tada' style='color:#ffff'></i></span>
    <h2 contenteditable="true" class="note-name">${item.name}</h2>
    <p class="note-date"> ${item.date}</p>
    <textarea placeholder="Tarefa" class="noteAl">${item.text}</textarea>
  `;
  content.appendChild(div);
}

function addAlertHTML(item, index) {
  const div = document.createElement("div");
  div.classList.add("Alert");
  div.style.backgroundColor = item.color;
  div.setAttribute("data-index", index);

  div.innerHTML = `
    <span class="remove"><i class='bx bx-x'></i></span>
    <h2 contenteditable="true" class="note-name">${item.name}</h2>
    <p class="note-date">${item.date}</p>
    <textarea placeholder="Tarefa de prioridade" class="Alertsy">${item.text}</textarea>
  `;
  content.appendChild(div);
}

function addEvents() {
  content.addEventListener("click", (e) => {
    if (e.target.closest(".remove")) {
      const parent = e.target.closest("[data-index]");
      const index = parseInt(parent.getAttribute("data-index"));
      removeItem(index);
    }
  });

  content.addEventListener("input", (e) => {
    const parent = e.target.closest("[data-index]");
    const index = parseInt(parent.getAttribute("data-index"));
    
    if (e.target.classList.contains("noteAl") || e.target.classList.contains("Alertsy")) {
      updateItemText(index, e.target.value);
    } else if (e.target.classList.contains("note-name")) {
      updateItemName(index, e.target.textContent);
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

function updateItemName(index, newName) {
  if (items_db[index]) {
    items_db[index].name = newName;
    updateLocalStorage();
  }
}

function verifyNulls() {
  items_db = items_db.filter((item) => item !== null && item !== undefined);
  updateLocalStorage();
}

if (localStorage.getItem('dark-theme') === 'true') {
  body.classList.add('dark-theme');
}

themeToggle2.addEventListener('click', () => {
  body.classList.toggle('dark-theme');
});

themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-theme');
  localStorage.setItem('dark-theme', body.classList.contains('dark-theme'));
});

function resetConfigurations() {
  localStorage.removeItem("dark-theme");
  body.classList.remove("dark-theme");
  localStorage.removeItem("items_db");
  items_db = [];
  content.innerHTML = "";
  alert("Configurações foram redefinidas!");
}

document.getElementById('resetbtn').addEventListener("click", resetConfigurations);
document.getElementById('btnreset')?.addEventListener("click", resetConfigurations);


addEvents();
loadItems();
