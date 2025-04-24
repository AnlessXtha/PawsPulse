import express from "express";
import {
  login,
  logout,
  register,
  validateUserFields,
} from "../controllers/auth.controller.js";
import { shouldBeAdmin, verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/register",
  (req, res, next) => {
    const userType = req.body.userType?.toLowerCase();

    if (userType === "vet" || userType === "admin") {
      return verifyToken(req, res, () => shouldBeAdmin(req, res, next));
    }
    next();
  },
  register
);

router.post("/login", login);

router.post("/logout", logout);

router.post("/validate-user", validateUserFields);

export default router;
