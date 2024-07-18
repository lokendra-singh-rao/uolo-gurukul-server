import express from "express";
import { addUser, deleteUser, listUsers } from "../controllers/user.js";
import multer, { memoryStorage } from "multer";
import { isAuthenticated } from "../middlewares/VerifyAuthToken.js";

const router = express.Router();
const upload = multer({ storage: memoryStorage() });

router
  .route("/users")
  .get(isAuthenticated, listUsers)
  .post(isAuthenticated, upload.single("image"), addUser)
  .delete(isAuthenticated, deleteUser);

export default router;
