import {Router} from "express";
import { registerUser, loginUser } from "../controllers/auth.js";
import { authenticate } from "../middleware/authenticate.js"; // <-- cek baris ini ada


const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authenticate, (req, res) => res.json({ user: req.user })); // <-- cek baris ini ada

export default router;