import express from "express";
import { database } from "../config/database.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateUser);

router.get("/", async (req, res) => {
  try {
    const result = await database.query(
      `SELECT id, bot_name, status, created_at
       FROM bots
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      bots: result.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Could not load bots"
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { bot_name } = req.body;

    if (!bot_name || !bot_name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Bot name is required"
      });
    }

    const result = await database.query(
      `INSERT INTO bots (user_id, bot_name, status)
       VALUES ($1, $2, 'stopped')
       RETURNING id, bot_name, status, created_at`,
      [req.user.id, bot_name.trim()]
    );

    res.status(201).json({
      success: true,
      bot: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Could not create bot"
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await database.query(
      "DELETE FROM bots WHERE id = $1 AND user_id = $2 RETURNING id",
      [req.params.id, req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Bot not found"
      });
    }

    res.json({
      success: true,
      message: "Bot record deleted"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Could not delete bot"
    });
  }
});

export default router;
