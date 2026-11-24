

import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import botRoutes from "./routes/bots.js";
import adminRoutes from "./routes/admin.js";
import { initializeDatabase } from "./config/database.js";

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/", (req, res) => {
  res.json({
    name: "GHOST BUGS HOST",
    status: "online",
    message: "WhatsApp Bot Hosting Platform"
  });
});

app.get("/api/status", (req, res) => {
  res.json({
    success: true,
    server: "GHOST BUGS HOST",
    status: "running"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/bots", botRoutes);
app.use("/api/admin", adminRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await initializeDatabase();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`GHOST BUGS HOST running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
