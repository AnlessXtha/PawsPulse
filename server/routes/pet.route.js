import express from "express";
import {
  getPets,
  getPet,
  updatePet,
  deletePet,
  getPetByUserId,
} from "../controllers/pet.controller.js";
import { shouldBeAdmin, verifyToken } from "../middleware/authMiddleware.js";
// import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", getPets);

router.get("/:id", getPet);

router.get("/user/:id", getPetByUserId);

router.put("/:id", verifyToken, updatePet);

router.delete("/:id", verifyToken, deletePet);

export default router;
