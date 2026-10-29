import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import { validate } from "../middleware/validate.js";
import { createProjectTask, listProjectTasks, updateProjectTaskStatus } from "../controllers/projectTask.js";
import { createProjectTaskSchema, idParam, projectIdParam, updateProjectTaskStatusSchema } from "../validators/schemas.js";

const router = Router();

router.get("/project/:projectId", authenticate, validate(projectIdParam, "params"), listProjectTasks);
router.post(
  "/project/:projectId",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN", "ACCOUNT_MANAGER"),
  validate(projectIdParam, "params"),
  validate(createProjectTaskSchema),
  createProjectTask
);
router.patch(
  "/:id/status",
  authenticate,
  validate(idParam, "params"),
  validate(updateProjectTaskStatusSchema),
  updateProjectTaskStatus
);

export default router;
