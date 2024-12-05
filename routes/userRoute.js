import { Router } from "express";
import {
  updateUser,
  deleteUser,
  getById,
} from "../controllers/userController.js";

const router = Router();

router.get("/:id", getById);
router.put("/update", updateUser);
router.put("/delete", deleteUser);

export default router;
