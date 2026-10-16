// server/src/routes/auth.routes.js
import { Router } from "express";
import { registerUser, loginUser, refreshAccessToken, logoutUser } from "../controllers/auth.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import { validate } from "../middleware/validate.js";
import { loginLimiter } from "../middleware/rateLimiters.js";
import { loginSchema, registerSchema } from "../validators/schemas.js";

const router = Router();

router.post("/register", authenticate, authorize("SUPER_ADMIN", "ADMIN"), validate(registerSchema), registerUser);
router.post("/login", loginLimiter, validate(loginSchema), loginUser);
router.get("/me", authenticate, (req, res) => res.json({ user: req.user }));
router.post("/refresh", refreshAccessToken);
router.post("/logout", logoutUser);

export default router;