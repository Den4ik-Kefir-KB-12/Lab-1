const STORAGE_KEY = "lr1_shifts_v11";
let items = [];
let currentEditId = null;

const form = document.getElementById("shiftForm");
const tbody = document.getElementById("itemsTableBody");
const resetBtn = document.getElementById("resetBtn");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const formTitle = document.getElementById("formTitle");

items = loadFromStorage();

renderTable();

form.addEventListener("submit", handleFormSubmit);
resetBtn.addEventListener("click", resetFormAndErrors);
tbody.addEventListener("click", handleTableClick);
searchInput.addEventListener("input", renderTable);
sortSelect.addEventListener("change", renderTable);


function handleFormSubmit(event) {
  event.preventDefault();

  const dto = readForm();
  const isValid = validate(dto);

  if (!isValid) return;

  if (currentEditId !== null) {
    const index = items.findIndex(x => x.id === currentEditId);
    if (index !== -1) {
      items[index] = { ...items[index], ...dto };
    }
  } else {
    const newItem = {
      id: computeNextId(items),
      ...dto
    };
    items.push(newItem);
  }

  saveToStorage(items);
  renderTable();
  resetFormAndErrors();
}

function handleTableClick(event) {
  const target = event.target;

  if (target.classList.contains("delete-btn")) {
    const id = Number(target.dataset.id);
    items = items.filter(x => x.id !== id);
    saveToStorage(items);
    renderTable();
    
    if (currentEditId === id) {
        resetFormAndErrors();
    }
    return;
  }

  if (target.classList.contains("edit-btn")) {
    const id = Number(target.dataset.id);
    startEdit(id);
    return;
  }
}

function readForm() {
  return {
    date: document.getElementById("dateInput").value,
    timeSlot: document.getElementById("timeSlotSelect").value,
    userName: document.getElementById("userInput").value.trim(),
    status: document.getElementById("statusSelect").value,
    comment: document.getElementById("commentInput").value.trim()
  };
}

function validate(dto) {
  clearErrors();
  let isValid = true;

  if (dto.date === "") {
    showError("dateInput", "dateError", "Оберіть дату чергування.");
    isValid = false;
  }

  if (dto.timeSlot === "") {
    showError("timeSlotSelect", "timeSlotError", "Оберіть часовий проміжок зі списку.");
    isValid = false;
  }

  if (dto.userName === "") {
    showError("userInput", "userError", "Поле є обов'язковим.");
    isValid = false;
  } else if (dto.userName.length < 3 || dto.userName.length > 30) {
    showError("userInput", "userError", "Довжина прізвища та ім'я має бути від 3 до 30 символів.");
    isValid = false;
  }

  if (dto.status === "") {
    showError("statusSelect", "statusError", "Оберіть статус.");
    isValid = false;
  }

  if (dto.comment.length > 0 && dto.comment.length < 5) {
    showError("commentInput", "commentError", "Коментар має містити щонайменше 5 символів.");
    isValid = false;
  }

  return isValid;
}

function showError(inputId, errorId, message) {
  document.getElementById(inputId).classList.add("invalid");
  document.getElementById(errorId).innerHTML = message;
}

function clearError(inputId, errorId) {
  document.getElementById(inputId).classList.remove("invalid");
  document.getElementById(errorId).innerHTML = "";
}

function clearErrors() {
  clearError("dateInput", "dateError");
  clearError("timeSlotSelect", "timeSlotError");
  clearError("userInput", "userError");
  clearError("statusSelect", "statusError");
  clearError("commentInput", "commentError");
}

function resetFormAndErrors() {
  form.reset();
  clearErrors();
  currentEditId = null;
  formTitle.innerText = "Додати чергування";
}

function startEdit(id) {
  const item = items.find(x => x.id === id);
  if (!item) return;

  document.getElementById("dateInput").value = item.date;
  document.getElementById("timeSlotSelect").value = item.timeSlot;
  document.getElementById("userInput").value = item.userName;
  document.getElementById("statusSelect").value = item.status;
  document.getElementById("commentInput").value = item.comment;

  currentEditId = id;
  formTitle.innerText = "Редагувати чергування (ID: " + id + ")";
  clearErrors();
}

function renderTable() {
  const searchQuery = searchInput.value.toLowerCase().trim();
  const sortDirection = sortSelect.value;

  let filteredItems = items.filter(item => 
    item.userName.toLowerCase().includes(searchQuery)
  );

  filteredItems.sort((a, b) => {
    if (a.date > b.date) return sortDirection === "asc" ? 1 : -1;
    if (a.date < b.date) return sortDirection === "asc" ? -1 : 1;
    return 0;
  });

  const rowsHtml = filteredItems.map((item, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${item.date}</td>
      <td>${item.timeSlot}</td>
      <td>${item.userName}</td>
      <td>${item.status}</td>
      <td>${item.comment}</td>
      <td>
        <button type="button" class="edit-btn" data-id="${item.id}">Редагувати</button>
        <button type="button" class="delete-btn" data-id="${item.id}">Видалити</button>
      </td>
    </tr>
  `).join("");

  tbody.innerHTML = rowsHtml;
}

function saveToStorage(itemsArray) {
  const json = JSON.stringify(itemsArray);
  localStorage.setItem(STORAGE_KEY, json);
}

function loadFromStorage() {
  const json = localStorage.getItem(STORAGE_KEY);
  if (json === null) return [];

  try {
    const data = JSON.parse(json);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function computeNextId(itemsArray) {
  if (itemsArray.length === 0) return 1;
  const maxId = Math.max(...itemsArray.map(x => x.id));
  return maxId + 1;
}