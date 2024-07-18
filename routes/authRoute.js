import { Router } from "express";
import { login } from "../controllers/auth.js";
const route = Router();

route.get("/login", login);

export default route;
