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

    tbody.innerHTML = filteredItems.map((item, index) => {
        let statusUA = item.status || "-";
        if (item.status === "Planned") statusUA = "Заплановано";
        if (item.status === "Completed") statusUA = "Виконано";
        if (item.status === "Cancelled") statusUA = "Скасовано";

        return `
            <tr>
                <td>${index + 1}</td>
                <td>${item.date || "-"}</td>
                <td>${item.timeSlot || "-"}</td>
                <td>${item.userName || item.name || "<i>(Без імені)</i>"}</td>
                <td>${statusUA}</td>
                <td>${item.comment || ""}</td>
                <td>
                    <button type="button" class="edit-btn" data-id="${item.id}">Редагувати</button>
                    <button type="button" class="delete-btn" data-id="${item.id}">Видалити</button>
                </td>
            </tr>
        `;
    }).join("");
}

export function showNotice(text, isError = false) {
    if (noticeEl) {
        noticeEl.innerHTML = text;
        noticeEl.style.color = isError ? "red" : "green";
        setTimeout(() => { noticeEl.innerHTML = ""; }, 4000);
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
    document.getElementById(errorId).innerHTML = message;
}

export function clearError(inputId, errorId) {
    document.getElementById(inputId).classList.remove("invalid");
    document.getElementById(errorId).innerHTML = "";
}

export function clearErrors() {
    clearError("dateInput", "dateError");
    clearError("timeSlotSelect", "timeSlotError");
    clearError("userInput", "userError");
    clearError("statusSelect", "statusError");
    clearError("commentInput", "commentError");
}