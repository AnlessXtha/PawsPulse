import express from "express";
import {
  getUsers,
  getVets,
  getUser,
  updateUser,
  deleteUser,
  updateVet,
} from "../controllers/user.controller.js";
import { shouldBeAdmin, verifyToken } from "../middleware/authMiddleware.js";
// import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/vets", getVets);

router.get("/:id", getUser);

router.put("/:id", verifyToken, updateUser);

router.put("/:id", verifyToken, updateVet);

router.delete("/:id", verifyToken, deleteUser);

export default router;
