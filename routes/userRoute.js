import express from "express";
import { addUser, deleteUser, listUsers } from "../controllers/user.js";
import multer, { memoryStorage } from "multer";

const router = express.Router();
const upload = multer({ storage: memoryStorage() });

router
  .route("/users")
  .get(listUsers)
  .post(upload.single("image"), addUser)
  .delete(deleteUser);

export default router;
