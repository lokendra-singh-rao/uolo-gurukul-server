import express from "express";
import {
  addUser,
  deleteUser,
  listUsers,
} from "../controllers/userController.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
router.get("/listUsers", listUsers);
router.post("/addUser", upload.single("image"), addUser);
router.delete("/delete", deleteUser);

export default router;
