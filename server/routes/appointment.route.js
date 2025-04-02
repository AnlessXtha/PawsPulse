import express from "express";
import { shouldBeAdmin, verifyToken } from "../middleware/authMiddleware.js";
import {
  getAppointments,
  getAppointment,
  addAppointment,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointment.controller.js";

const router = express.Router();

router.get("/", verifyToken, shouldBeAdmin, getAppointments);
router.get("/:id", verifyToken, getAppointment);
router.post("/", verifyToken, addAppointment);
router.put("/:id", verifyToken, updateAppointment);
router.delete("/:id", verifyToken, shouldBeAdmin, deleteAppointment);

export default router;
