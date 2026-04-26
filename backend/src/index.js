const express = require("express");
const app = express();

const shiftsRoutes = require("./routes/shifts.routes");
const usersRoutes = require("./routes/users.routes");

const { errorHandler } = require("./middleware/error.middleware");

app.use(express.json());

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`);
  });
  next();
});

app.use("/api/shifts", shiftsRoutes);
app.use("/api/users", usersRoutes);

app.use(errorHandler);

app.listen(3000, () => {
  console.log("API started on http://localhost:3000");
});