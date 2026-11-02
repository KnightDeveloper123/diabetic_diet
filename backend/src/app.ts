
import express, { type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./routes/auth.routes.js";
import healthRoutes from "./routes/patient.routes.js";
import calculationRoutes from "./routes/calculation.routes.js";
import path from "path";
import process from "process";
import { fileURLToPath } from "url";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/public', express.static(path.resolve(__dirname, '../public')));


app.get("/", (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Diabetic Diet Assistant API is running",
  });
});

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/calculation", calculationRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;
