import {Router} from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import { createTask, getTasksByOrganization, completeTask } from "../controllers/onboardingTask.js";
import { validate } from "../middleware/validate.js";
import { createTaskSchema, idParam, organizationIdParam } from "../validators/schemas.js";

const router = Router();

router.post("/",authenticate, authorize("SUPER_ADMIN","ADMIN","ACCOUNT_MANAGER"),validate(createTaskSchema),createTask);
router.get("/organization/:organizationId", authenticate,validate(organizationIdParam, "params"), getTasksByOrganization);
router.patch("/:id/complete", authenticate, validate(idParam, "params"),completeTask);

export default router;