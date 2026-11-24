import express from "express";
import { database } from "../config/database.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateUser);

router.use((req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access only"
    });
  }

  next();
});

router.get("/overview", async (req, res) => {
  try {
    const users = await database.query(
      "SELECT COUNT(*) FROM users"
    );

    const bots = await database.query(
      "SELECT COUNT(*) FROM bots"
    );

    const running = await database.query(
      "SELECT COUNT(*) FROM bots WHERE status = 'running'"
    );

    res.json({
      success: true,
      statistics: {
        totalUsers: Number(users.rows[0].count),
        totalBots: Number(bots.rows[0].count),
        runningBots: Number(running.rows[0].count)
      }
    });
  } catch (error) {
    console.error("Admin error:", error.message);

    res.status(500).json({
      success: false,
      message: "Could not load admin statistics"
    });
  }
});

router.get("/users", async (req, res) => {
  try {
    const result = await database.query(
      `SELECT id, name, email, role, created_at
       FROM users
       ORDER BY created_at DESC`
    );

    res.json({
      success: true,
      users: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not load users"
    });
  }
});

export default router;
