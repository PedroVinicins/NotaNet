const content = document.querySelector(".content");
const btnNew = document.querySelector(".addNote-content");
const noteAf = document.querySelector(".noteAf");
const noteAl = document.querySelector(".noteAl");

let items_db = localStorage.getItem("items_db")
  ? JSON.parse(localStorage.getItem("items_db"))
  : [];

const colors = {
  default: "coral",
  noteAf: "#10B18B",
  noteAl: "#DC1E00",
};
const randomColor = () => colors.default;

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

  addEvents();
}

btnNew.onclick = () => {
  addNewItem();
};

noteAf.onclick = () => {
  addNewAlert(colors.noteAf);
};

noteAl.onclick = () => {
  addNewAlert(colors.noteAl);
};

function addNewItem(color = randomColor()) {
  const newItem = {
    text: "➤  ",
    color: color,
    type: "Note"
  };
  items_db.push(newItem);
  localStorage.setItem("items_db", JSON.stringify(items_db));
  loadItems();
}

function addNewAlert(color) {
  const newItem = {
    text: "➤  ",
    color: color,
    type: "Alert"
  };
  items_db.unshift(newItem);
  localStorage.setItem("items_db", JSON.stringify(items_db));
  loadItems();
}

function addHTML(item, i) {
  const div = document.createElement("div");

  div.innerHTML = `<div class="item" style="background-color: ${
    item.color
  }">
    <span class="remove">✘</span>
    <textarea>${item.text}</textarea>
  </div>`;

  content.appendChild(div);
}

function addAlertHTML(item, i) {
  const div = document.createElement("div");

  div.innerHTML = `<div class="Alert" style="background-color: ${
    item.color
  }">
    <span class="remove-1">✘</span>
    <textarea class="Alertsy">${item.text}</textarea>
  </div>`;

  content.appendChild(div);
}

function addEvents() {
  const notes = document.querySelectorAll(".item textarea");
  const alerts = document.querySelectorAll(".Alert textarea");
  const removeNotes = document.querySelectorAll(".item .remove");
  const removeAlerts = document.querySelectorAll(".Alert .remove-1");

  notes.forEach((item, i) => {
    item.oninput = () => {
      items_db[i] = {
        text: item.value,
        color: items_db[i].color,
        type: "Note"
      };

      localStorage.setItem("items_db", JSON.stringify(items_db));
    };
  });

  alerts.forEach((item, i) => {
    item.oninput = () => {
      items_db[i] = {
        text: item.value,
        color: items_db[i].color,
        type: "Alert"
      };

      localStorage.setItem("items_db", JSON.stringify(items_db));
    };
  });

  removeNotes.forEach((item, i) => {
    item.onclick = () => {
      items_db.splice(i, 1);
      localStorage.setItem("items_db", JSON.stringify(items_db));
      loadItems();
    };
  });

  removeAlerts.forEach((item, i) => {
    item.onclick = () => {
      items_db.splice(i, 1);
      localStorage.setItem("items_db", JSON.stringify(items_db));
      loadItems();
    };
  });
}

function verifyNulls() {
  items_db = items_db.filter((item) => item !== null && item !== undefined);
  localStorage.setItem("items_db", JSON.stringify(items_db));
}

loadItems();
