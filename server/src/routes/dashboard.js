import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import { getSummary } from "../controllers/dashboard.js";

const router = Router();

router.get("/summary", authenticate, authorize("SUPER_ADMIN", "ADMIN", "ACCOUNT_MANAGER", "STAFF"), getSummary);

export default router;