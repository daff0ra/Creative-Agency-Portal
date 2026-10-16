import {Router} from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import { getSummary } from "../controllers/dashboard.js";
import { validate } from "../middleware/validate.js";

const router = Router();

// jangan lupa kapan kapan ganti authorize sesuai sama kebutuhan aja, semisal dibuat jadi 3 jenis
router.get("/summary", authenticate,authorize("SUPER_ADMIN", "ADMIN", "ACCOUNT_MANAGER", "STAFF"), validate(getSummary),getSummary);

export default router;