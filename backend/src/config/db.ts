
import mysql2, { type Pool, type PoolOptions } from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const dbconfig: PoolOptions = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
    ? Number(process.env.DB_PORT)
    : undefined,
  connectionLimit: 10,
};

const connection: Pool = mysql2.createPool(dbconfig);

connection.getConnection((err, conn) => {
  if (err) {
    console.error("Database connection failed:", err.message);
    return;
  }

  console.log("Database connected");
  conn.release();
});

export default connection;
