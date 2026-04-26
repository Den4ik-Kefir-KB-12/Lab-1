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

## Лабораторна робота №2. Бекенд без БД 
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
