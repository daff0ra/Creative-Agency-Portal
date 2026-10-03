import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

import {
    createProject, getProjectByOrganization, updateProjectStatus, assiggnTeam
} from "../controllers/project.js"

const router = Router();
const agencyStaff = authorize("SUPER_ADMIN", "ADMIN", "ACCOUNT_MANAGER");

router.post("/", authenticate, agencyStaff, createProject);
router.get("/organization/:organizationId", authenticate, getProjectByOrganization);
// ["invited", "in_progress", "completed"],
router.patch("/:id/status", authenticate, updateProjectStatus);
router.patch("/:id/team", authenticate, agencyStaff, assiggnTeam);

export default router;