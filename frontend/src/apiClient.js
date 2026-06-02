import { API_BASE_URL } from "./config.js";

async function request(path, options = {}, timeoutMs = 10000) {
    const url = `${API_BASE_URL}${path}`;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    let response;

    const headers = {
        "X-Demo-UserId": "1", 
        ...(options.headers || {})
    };

    try {
        response = await fetch(url, {
            ...options,
            headers,
            signal: controller.signal
        });
    } catch (e) {
        clearTimeout(id);
        if (e.name === "AbortError") {
            throw { status: 0, message: "Перевищено час очікування запиту", details: "" };
        }
        throw {
            status: 0,
            message: "Помилка мережі або CORS",
            details: e?.message || String(e),
        };
    } finally {
        clearTimeout(id);
    }

    if (response.status === 204) {
        if (!response.ok) {
            throw { status: response.status, message: "Помилка", details: "No Content" };
        }
        return null;
    }

    const rawText = await response.text();

    if (response.ok) {
        if (!rawText) return null;
        try {
            return JSON.parse(rawText);
        } catch {
            return rawText;
        }
    }

    let errPayload = null;
    try {
        errPayload = rawText ? JSON.parse(rawText) : null;
    } catch {}

    throw {
        status: response.status,
        message: errPayload?.message || "HTTP помилка",
        details: errPayload?.detail || rawText || `HTTP ${response.status}`,
        errors: errPayload?.errors || null,
    };
}

export async function getShifts() {
    return await request("/shifts", { method: "GET" });
}

export async function createShift(dto) {
    return await request("/shifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
    });
}

export async function updateShift(id, dto) {
    return await request(`/shifts/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
    });
}

export async function deleteShift(id) {
    return await request(`/shifts/${encodeURIComponent(id)}`, {
        method: "DELETE",
    });
}