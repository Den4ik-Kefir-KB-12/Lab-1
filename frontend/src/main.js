import * as api from "./apiClient.js";
import * as ui from "./ui.js";

let currentEditId = null;
let currentItems = [];

document.getElementById("shiftForm").addEventListener("submit", handleFormSubmit);
document.getElementById("resetBtn").addEventListener("click", () => {
    ui.resetForm();
    currentEditId = null;
});
document.getElementById("itemsTableBody").addEventListener("click", handleTableClick);
document.getElementById("searchInput").addEventListener("input", updateTableRender);
document.getElementById("sortSelect").addEventListener("change", updateTableRender);

loadList();

async function loadList() {
    ui.renderListStatus("loading");
    ui.renderTable([]); 
    
    try {
        const responseData = await api.getShifts();
        let items = [];
        
        if (Array.isArray(responseData)) {
            items = responseData;
        } else if (responseData && typeof responseData === 'object') {
            if (Array.isArray(responseData.data)) items = responseData.data;
            else if (Array.isArray(responseData.shifts)) items = responseData.shifts;
            else if (Array.isArray(responseData.items)) items = responseData.items;
        }
        
        if (!Array.isArray(items)) {
            items = [];
        }

        items = items.map(item => {
            const localMeta = localStorage.getItem(`shift_meta_${item.id}`);
            if (localMeta) {
                try {
                    const meta = JSON.parse(localMeta);
                    return { ...item, ...meta };
                } catch (e) {
                    console.error("Помилка парсингу метаданих:", e);
                }
            }
            return item;
        });
        
        if (items.length === 0) {
            ui.renderListStatus("empty");
            currentItems = [];
        } else {
            ui.renderListStatus("success");
            currentItems = items;
            updateTableRender();
        }
    } catch (err) {
        console.error("Помилка у loadList:", err);
        ui.renderListStatus("error", err);
        currentItems = [];
    }
}

function updateTableRender() {
    const searchQuery = document.getElementById("searchInput").value;
    const sortDirection = document.getElementById("sortSelect").value;
    ui.renderTable(currentItems, searchQuery, sortDirection);
}

async function handleFormSubmit(event) {
    event.preventDefault();
    
    const dto = ui.readForm();
    if (!validateLocal(dto)) return;

    ui.setFormEnabled(false);

    try {
        if (currentEditId !== null) {
            await api.updateShift(currentEditId, dto);
            
            const meta = { userName: dto.userName, timeSlot: dto.timeSlot, comment: dto.comment };
            localStorage.setItem(`shift_meta_${currentEditId}`, JSON.stringify(meta));
            
            ui.showNotice("Запис успішно оновлено!");
        } else {
            const serverItem = await api.createShift(dto);
            const targetId = serverItem?.id || serverItem?.item?.id;
            
            if (targetId) {
                const meta = { userName: dto.userName, timeSlot: dto.timeSlot, comment: dto.comment };
                localStorage.setItem(`shift_meta_${targetId}`, JSON.stringify(meta));
            }
            
            ui.showNotice("Новий запис створено!");
        }
        
        ui.resetForm();
        currentEditId = null;
        await loadList();
    } catch (err) {
        console.error(err);
        ui.showNotice(`Помилка: ${err.message}`, true);
    } finally {
        ui.setFormEnabled(true);
    }
}

async function handleTableClick(event) {
    const target = event.target;
    const id = target.dataset.id;
    if (!id) return;

    if (target.classList.contains("delete-btn")) {
        if (!confirm("Ви впевнені, що хочете видалити цей запис?")) return;
        
        ui.setFormEnabled(false); 
        try {
            await api.deleteShift(id);
            localStorage.removeItem(`shift_meta_${id}`);
            ui.showNotice("Запис видалено!");
            if (currentEditId == id) {
                ui.resetForm();
                currentEditId = null;
            }
            await loadList();
        } catch (err) {
            ui.showNotice(`Не вдалося видалити: ${err.message}`, true);
        } finally {
            ui.setFormEnabled(true);
        }
    }

    if (target.classList.contains("edit-btn")) {
        const item = currentItems.find(x => x.id == id);
        if (item) {
            ui.fillForm(item);
            ui.clearErrors();
            currentEditId = id;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
}

function validateLocal(dto) {
    ui.clearErrors();
    let isValid = true;

    if (!dto.date) {
        ui.showError("dateInput", "dateError", "Оберіть дату чергування.");
        isValid = false;
    }
    if (!dto.timeSlot) {
        ui.showError("timeSlotSelect", "timeSlotError", "Оберіть часовий проміжок.");
        isValid = false;
    }
    if (!dto.userName) {
        ui.showError("userInput", "userError", "Поле є обов'язковим.");
        isValid = false;
    } else if (dto.userName.length < 3 || dto.userName.length > 30) {
        ui.showError("userInput", "userError", "Довжина має бути від 3 до 30 символів.");
        isValid = false;
    }
    if (!dto.status) {
        ui.showError("statusSelect", "statusError", "Оберіть статус.");
        isValid = false;
    }
    if (dto.comment && dto.comment.length < 5) {
        ui.showError("commentInput", "commentError", "Коментар має містити щонайменше 5 символів.");
        isValid = false;
    }

    return isValid;
}