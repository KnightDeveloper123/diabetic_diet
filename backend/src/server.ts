
import "dotenv/config";

import app from "./app.js";
import connection from "./config/db.js";
import { connectRedis, disconnectRedis } from "./config/redis.js";

const PORT = Number(process.env.PORT) || 5000;

const startServer = async (): Promise<void> => {
  try {
    await connection.promise().query("SELECT 1");
    console.log("MySQL connected successfully");

    await connectRedis();

    const server = app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });

    const shutdown = async (): Promise<void> => {
      console.log("Shutting down server...");

      server.close(async () => {
        try {
          await disconnectRedis();
          await connection.promise().end();
          process.exit(0);
        } catch (error) {
          console.error("Shutdown error:", error);
          process.exit(1);
        }
      });
    };

    process.once("SIGINT", () => void shutdown());
    process.once("SIGTERM", () => void shutdown());
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

void startServer();
