# Лабораторна робота №1. Фронтенд
## Варіант №11
**Тема:** Сервіс чергувань у лабораторії
**Ключова сутність:** Чергування (Shifts)
## Функціонал
* Додавання нових чергувань
* Відображення списку чергувань у таблиці
* Можливість зміни та видалення
* Пошук чергувань за ім'ям
* Сортування за датою
* Збереження даних
## Запуск
**Python:**
python -m http.server 8080

http://localhost:8080

---

# Лабораторна робота №2. Бекенд без БД 
## Варіант №11
### Як запустити бекенд

1. Відкрийте термінал і перейдіть у папку бекенду:
   ```bash
   cd backend
2. Встановіть залежності:
   ```bash
   npm install
3. Запустіть сервер у режимі розробки:
   ```bash
   npm run dev
Сервер запуститься за адресою: http://localhost:3000

### Реалізовані сутності
Users: Користувачі (поля: id, name, email)

Shifts: Чергування (поля: id, userName, date, status)

### Приклади запитів (cURL)
1. Створити нове чергування (Успіх - 201 Created):
   ```bash
   curl -i -X POST http://localhost:3000/api/shifts -H "Content-Type: application/json" -d "{\"userName\":\"Alex\",\"date\":\"2026-04-26\",\"status\":\"Open\"}"
2. Помилка валідації (400 Bad Request - пусте ім'я користувача):
   ```bash
   curl -i -X POST http://localhost:3000/api/shifts -H "Content-Type: application/json" -d "{\"userName\":\"\",\"status\":\"Open\"}"
3. Отримати список усіх чергувань (200 OK):
   ```bash
   curl -i http://localhost:3000/api/shifts
4. Отримати список усіх користувачів (200 OK):
   ```bash
   curl -i http://localhost:3000/api/users

# Лабораторна робота №3 - REST API з SQLite

## Як запустити проєкт
1. Встановіть залежності командою: `npm install`
2. Запустіть сервер у режимі розробки: `npm run dev` (або `node src/index.js`)
3. Сервер запуститься на порту 3000 (`http://localhost:3000`).

## Де створюється база даних
Під час першого запуску сервера автоматично виконується ініціалізація бази даних. 
Файл бази створюється у корені проєкту в директорії `data/` і має назву `app.db` (цей файл додано у `.gitignore`).

## Схема БД (Структура)
База даних складається з двох пов'язаних таблиць (зв'язок 1:N). Обмеження цілісності підтримуються через `PRAGMA foreign_keys = ON;`.

**Таблиця 1: Users (Користувачі)**
- `id` (INTEGER PRIMARY KEY)
- `email` (TEXT NOT NULL UNIQUE) - обмеження унікальності
- `name` (TEXT NOT NULL)
- `createdAt` (TEXT NOT NULL)

**Таблиця 2: Shifts (Чергування)**
- `id` (INTEGER PRIMARY KEY)
- `userId` (INTEGER NOT NULL) - зовнішній ключ (FOREIGN KEY) до `Users(id)` з `ON DELETE CASCADE`.
- `date` (TEXT NOT NULL)
- `status` (TEXT NOT NULL)
- `createdAt` (TEXT NOT NULL)

## Приклади запитів (cURL)

**Створити користувача:**
curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d "{\"email\":\"test@gmail.com\", \"name\":\"Ivan\"}"

**Отримати список чергувань:**
curl http://localhost:3000/api/shifts

**Створити чергування:**
curl -X POST http://localhost:3000/api/shifts -H "Content-Type: application/json" -d "{\"userId\":1, \"date\":\"2026-05-02\", \"status\":\"Open\"}"
