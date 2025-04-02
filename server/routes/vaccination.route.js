import express from "express";
import { shouldBeAdmin, verifyToken } from "../middleware/authMiddleware.js";
import {
  getVaccinations,
  getVaccination,
  addVaccination,
  updateVaccination,
  deleteVaccination,
} from "../controllers/vaccination.controller.js";

const router = express.Router();

router.get("/", verifyToken, shouldBeAdmin, getVaccinations);
router.get("/:id", verifyToken, getVaccination);
router.post("/", verifyToken, addVaccination);
router.put("/:id", verifyToken, updateVaccination);
router.delete("/:id", verifyToken, deleteVaccination);

export default router;
