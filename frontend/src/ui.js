const tbody = document.getElementById("itemsTableBody");
const listStatus = document.getElementById("listStatus");
const noticeEl = document.getElementById("notice");
const formTitle = document.getElementById("formTitle");
const form = document.getElementById("shiftForm");

export function renderListStatus(status, error = null) {
    if (status === "loading") {
        listStatus.innerHTML = "Завантаження даних з сервера...";
        listStatus.style.color = "blue";
    } else if (status === "empty") {
        listStatus.innerHTML = "Поки що немає записів.";
        listStatus.style.color = "black";
    } else if (status === "error") {
        listStatus.innerHTML = `Помилка завантаження: ${error?.message || "невідома"}`;
        listStatus.style.color = "red";
    } else {
        listStatus.innerHTML = ""; 
    }
}

export function renderTable(items, searchQuery = "", sortDirection = "asc") {
    let filteredItems = items.filter(item => {
        const userName = item.userName || item.name || "";
        const query = searchQuery || "";
        return userName.toLowerCase().includes(query.toLowerCase());
    });

    filteredItems.sort((a, b) => {
        const dateA = a.date || "";
        const dateB = b.date || "";
        if (dateA > dateB) return sortDirection === "asc" ? 1 : -1;
        if (dateA < dateB) return sortDirection === "asc" ? -1 : 1;
        return 0;
    });

    tbody.innerHTML = "";

    filteredItems.forEach((item, index) => {
        let statusUA = item.status || "-";
        if (item.status === "Planned") statusUA = "Заплановано";
        if (item.status === "Completed") statusUA = "Виконано";
        if (item.status === "Cancelled") statusUA = "Скасовано";

        const tr = document.createElement("tr");

        const tdIndex = document.createElement("td");
        tdIndex.textContent = index + 1;

        const tdDate = document.createElement("td");
        tdDate.textContent = item.date || "-";

        const tdTime = document.createElement("td");
        tdTime.textContent = item.timeSlot || "-";

        const tdUser = document.createElement("td");
        if (item.userName || item.name) {
            tdUser.textContent = item.userName || item.name;
        } else {
            tdUser.innerHTML = "<i>(Без імені)</i>";
        }

        const tdStatus = document.createElement("td");
        tdStatus.textContent = statusUA;

        const tdComment = document.createElement("td");
        tdComment.textContent = item.comment || ""; 

        const tdActions = document.createElement("td");
        const editBtn = document.createElement("button");
        editBtn.type = "button";
        editBtn.className = "edit-btn";
        editBtn.dataset.id = item.id;
        editBtn.textContent = "Редагувати";

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "delete-btn";
        deleteBtn.dataset.id = item.id;
        deleteBtn.textContent = "Видалити";

        tdActions.append(editBtn, " ", deleteBtn);

        tr.append(tdIndex, tdDate, tdTime, tdUser, tdStatus, tdComment, tdActions);
        tbody.appendChild(tr);
    });
}

export function showNotice(text, isError = false) {
    if (noticeEl) {
        noticeEl.textContent = text; 
        noticeEl.style.color = isError ? "red" : "green";
        setTimeout(() => { noticeEl.textContent = ""; }, 4000);
    }
    
    if (isError) {
        alert("ПОМИЛКА: " + text);
    }
}

export function setFormEnabled(isEnabled) {
    const inputs = form.querySelectorAll("input, select, textarea, button");
    inputs.forEach(input => input.disabled = !isEnabled);
}

export function readForm() {
    let statusValue = document.getElementById("statusSelect").value;
    
    if (statusValue === "Заплановано") statusValue = "Planned";
    if (statusValue === "Виконано") statusValue = "Completed";
    if (statusValue === "Скасовано") statusValue = "Cancelled";

    return {
        date: document.getElementById("dateInput").value,
        timeSlot: document.getElementById("timeSlotSelect").value,
        userName: document.getElementById("userInput").value.trim(),
        status: statusValue, 
        comment: document.getElementById("commentInput").value.trim(),
        userId: 1 
    };
}

export function fillForm(item) {
    let statusFormValue = "";
    if (item.status === "Planned" || item.status === "Заплановано") statusFormValue = "Заплановано";
    if (item.status === "Completed" || item.status === "Виконано") statusFormValue = "Виконано";
    if (item.status === "Cancelled" || item.status === "Скасовано") statusFormValue = "Скасовано";

    document.getElementById("dateInput").value = item.date || "";
    document.getElementById("timeSlotSelect").value = item.timeSlot || "";
    document.getElementById("userInput").value = item.userName || item.name || "";
    document.getElementById("statusSelect").value = statusFormValue;
    document.getElementById("commentInput").value = item.comment || "";
    formTitle.innerText = `Редагувати чергування (ID: ${item.id})`;
}

export function resetForm() {
    form.reset();
    clearErrors();
    formTitle.innerText = "Додати чергування";
}

export function showError(inputId, errorId, message) {
    document.getElementById(inputId).classList.add("invalid");
    document.getElementById(errorId).textContent = message; 
}

export function clearError(inputId, errorId) {
    document.getElementById(inputId).classList.remove("invalid");
    document.getElementById(errorId).textContent = ""; 
}

export function clearErrors() {
    clearError("dateInput", "dateError");
    clearError("timeSlotSelect", "timeSlotError");
    clearError("userInput", "userError");
    clearError("statusSelect", "statusError");
    clearError("commentInput", "commentError");
}