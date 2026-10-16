import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

import {
    createProject, getProjectByOrganization, updateProjectStatus, assignTeam
} from "../controllers/project.js"

import { validate } from "../middleware/validate.js";
import { assignTeamSchema, createProjectSchema, idParam, organizationIdParam, updateProjectStatusSchema } from "../validators/schemas.js";

const router = Router();
const agencyStaff = authorize("SUPER_ADMIN", "ADMIN", "ACCOUNT_MANAGER");

router.post("/", authenticate, agencyStaff, validate(createProjectSchema),createProject);
router.get("/organization/:organizationId", authenticate, validate(organizationIdParam, "params"), getProjectByOrganization);
// ["invited", "in_progress", "completed"],
router.patch("/:id/status", authenticate, validate(idParam, "params"), validate(updateProjectStatusSchema), updateProjectStatus);
router.patch("/:id/team", authenticate, agencyStaff, validate(idParam, "params"),validate(assignTeamSchema), assignTeam);

export default router;