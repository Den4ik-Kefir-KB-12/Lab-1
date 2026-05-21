const express = require("express");
const cors = require("cors");
const app = express();

const { initDb } = require("./db/initDb");

const shiftsRoutes = require("./routes/shifts.routes");
const usersRoutes = require("./routes/users.routes");
const swapRequestsRoutes = require("./routes/swapRequests.routes"); 

const { errorHandler } = require("./middleware/error.middleware");

const allowedOrigins = [
  "http://localhost:5500",
  "http://127.0.0.1:5500" 
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options(/(.*)/, cors());


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
app.use("/api/swap-requests", swapRequestsRoutes); 

app.use(errorHandler);

async function bootstrap() {
  await initDb();
  
  app.listen(3000, () => {
    console.log("API started on http://localhost:3000");
  });
}

bootstrap().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});