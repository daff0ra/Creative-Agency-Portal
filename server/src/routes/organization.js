import {Router} from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import { createOrganization, getOrganizations, getOrganizationById, 
    assignAccountManager } from "../controllers/organization.js";

import { validate } from "../middleware/validate.js";
import { assignAccountManagerSchema, createOrganizationSchema, idParam } from "../validators/schemas.js";

const router = Router();
const agencyStaff = authorize("SUPER_ADMIN", "ADMIN", "ACCOUNT_MANAGER");

router.post("/", authenticate, agencyStaff,validate(createOrganizationSchema), createOrganization);
router.get("/", authenticate, agencyStaff,getOrganizations);
router.get("/:id", authenticate,validate(idParam, "params"), getOrganizationById);
router.patch("/:id/account-manager", authenticate, authorize("SUPER_ADMIN", "ADMIN"), 
    validate(idParam, "params"), validate(assignAccountManagerSchema), assignAccountManager);

export default router;