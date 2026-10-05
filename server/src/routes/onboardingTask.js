import {Router} from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import { createTask, getTasksByOrganization, completeTask } from "../controllers/onboardingTask.js";

const router = Router();

router.post("/",authenticate, authorize("SUPER_ADMIN","ADMIN","ACCOUNT_MANAGER"),createTask);
router.get("/organization/:organizationId", authenticate, getTasksByOrganization);
router.patch("/:id/complete", authenticate, completeTask);

export default router;