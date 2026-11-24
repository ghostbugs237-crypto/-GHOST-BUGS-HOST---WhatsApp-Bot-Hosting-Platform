
import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`GHOST BUGS HOST running on port ${PORT}`);
});
