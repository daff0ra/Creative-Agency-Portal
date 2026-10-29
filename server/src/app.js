import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.routes.js"; 
import organizationRoutes from "./routes/organization.js"
import projectRoutes from "./routes/project.routes.js"
import onboardingTaskRoutes from "./routes/onboardingTask.js";
import dashboardRoutes from "./routes/dashboard.js"
import userRoutes from "./routes/user.js";
import projectTaskRoutes from "./routes/projectTask.routes.js";

const app = express();

// Allow a comma-separated list so production and local development clients can
// use the API without opening credentialed CORS to every origin.
const allowedClientOrigins = (
    process.env.CLIENT_ORIGINS || process.env.CLIENT_ORIGIN || "http://localhost:5173"
).split(",").map((origin) => origin.trim()).filter(Boolean);

// Hop proxy di depan aplikasi (0 saat lokal). Angka yang salah bisa membuat IP palsu lolos rate limit,
app.set("trust proxy", Number(process.env.TRUST_PROXY || 0));

app.get("/health", (req, res) => {
    const dbUp = mongoose.connection.readyState === 1; // 1 = terhubung
    res.status(dbUp ? 200 : 503).json({ status: dbUp ? "ok" : "db_down" });
  });

app.use(cors({
    origin: (origin, callback) => {
        // Requests without an Origin header (for example health checks) are not browser CORS requests.
        if (!origin) return callback(null, false);
        return callback(null, allowedClientOrigins.includes(origin));
    },
    credentials: true,
}));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());


app.use("/auth", authRoutes);
app.use("/organizations", organizationRoutes);
app.use("/projects", projectRoutes)
app.use("/project-tasks", projectTaskRoutes);
app.use("/onboardingTask", onboardingTaskRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/users",userRoutes);

app.use((req, res) => {
    res.status(404).json({ message: `Endpoint tidak ditemukan: ${req.method} ${req.originalUrl}` });
});
app.use(errorHandler);

export default app;
