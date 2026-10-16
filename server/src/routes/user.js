import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import { listStaff } from "../controllers/user.js";

const router = Router();

router.get("/staff", authenticate, authorize("SUPER_ADMIN", "ADMIN", "ACCOUNT_MANAGER"), listStaff);

export default router;