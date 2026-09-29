import {Router} from "express";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize.js";
import { createOrganization, getOrganizations, getOrganizationById } from "../controllers/organization.js";

const router = router();
const agencyStaff = authorize("SUPER_ADMIN", "ADMIN", "ACCOUNT_MANAGER");

router.post("/", authenticate, agencyStaff, createOrganization);
router.get("/", authenticate, agencyStaff, getOrganizations);
router.get("/", authenticate, getOrganizationById);

export default router;