import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

export const database = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false
});

database.on("connect", () => {
  console.log("GHOST BUGS HOST: Database connected");
});

database.on("error", (error) => {
  console.error("Database error:", error.message);
});

export async function testDatabase() {
  try {
    await database.query("SELECT NOW()");
    console.log("Database connection successful");
    return true;
  } catch (error) {
    console.error("Database connection failed:", error.message);
    return false;
  }
}
