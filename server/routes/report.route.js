import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  getReports,
  getReport,
  addReport,
  updateReport,
  deleteReport,
} from "../controllers/report.controller.js";

const router = express.Router();

router.get("/", getReports);
router.get("/:id", getReport);
router.post("/", verifyToken, addReport);
router.put("/:id", verifyToken, updateReport);
router.delete("/:id", verifyToken, deleteReport);

export default router;
