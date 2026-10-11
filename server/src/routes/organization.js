import {Router} from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import { createOrganization, getOrganizations, getOrganizationById, 
    assignAccountManager } from "../controllers/organization.js";

const router = Router();
const agencyStaff = authorize("SUPER_ADMIN", "ADMIN", "ACCOUNT_MANAGER");

router.post("/", authenticate, agencyStaff, createOrganization);
router.get("/", authenticate, agencyStaff, getOrganizations);
router.get("/:id", authenticate, getOrganizationById);
router.patch("/:id/account-manager", authenticate, authorize("SUPER_ADMIN", "ADMIN"), 
    assignAccountManager);

export default router;