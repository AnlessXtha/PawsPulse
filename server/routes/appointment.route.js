import express from "express";
import { shouldBeAdmin, verifyToken } from "../middleware/authMiddleware.js";
import {
  getAppointments,
  getAppointment,
  addAppointment,
  updateAppointment,
  deleteAppointment,
  getVetSchedule,
  addRecurringAppointments,
} from "../controllers/appointment.controller.js";

const router = express.Router();

router.get("/", verifyToken, getAppointments);
router.get("/:id", verifyToken, getAppointment);
router.post("/", verifyToken, addAppointment);
router.post("/recurring", verifyToken, addRecurringAppointments);
router.put("/:id", verifyToken, updateAppointment);
router.delete("/:id", verifyToken, shouldBeAdmin, deleteAppointment);
router.get("/vet-schedule/:id", verifyToken, getVetSchedule);

export default router;
