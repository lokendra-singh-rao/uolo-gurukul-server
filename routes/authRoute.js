import { Router } from "express";
import { login } from "../controllers/authController";
const route = Router();

route.get("/login", login);
