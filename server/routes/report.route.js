import express from "express";
import { shouldBeAdmin, verifyToken } from "../middleware/authMiddleware.js";
import {
  getReports,
  getReport,
  createReport,
  updateReport,
  deleteReport,
} from "../controllers/report.controller.js";

const router = express.Router();

router.get("/", verifyToken, getReports);
router.get("/:id", verifyToken, getReport);
router.post("/", verifyToken, createReport);
router.put("/:id", verifyToken, updateReport);
router.delete("/:id", verifyToken, deleteReport);

export default router;
