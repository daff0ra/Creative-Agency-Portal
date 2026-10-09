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

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(errorHandler);

app.use("/auth", authRoutes);
app.use("/organizations", organizationRoutes);
app.use("/projects", projectRoutes)
app.use("/onboardingTask", onboardingTaskRoutes);
app.use("/dashboard", dashboardRoutes);

// another /
export default app;
