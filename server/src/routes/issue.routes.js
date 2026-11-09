import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { validate } from "../middleware/validate.js";
import { createIssue, convertIssueToTask, listIssues, updateIssue } from "../controllers/issue.js";
import { createIssueSchema, idParam, updateIssueSchema } from "../validators/schemas.js";

const router = Router();
router.use(authenticate);
router.get("/", listIssues);
router.post("/", validate(createIssueSchema), createIssue);
router.patch("/:id", validate(idParam, "params"), validate(updateIssueSchema), updateIssue);
router.post("/:id/task", validate(idParam, "params"), convertIssueToTask);
export default router;
