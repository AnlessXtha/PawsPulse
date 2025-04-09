import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  getReports,
  getReport,
  createReport,
  updateReport,
  deleteReport,
} from "../controllers/report.controller.js";

const router = express.Router();

router.get("/", getReports);
router.get("/:id", getReport);
router.post("/", verifyToken, createReport);
router.put("/:id", verifyToken, updateReport);
router.delete("/:id", verifyToken, deleteReport);

export default router;
