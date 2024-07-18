import { Router } from "express";
import { login, logout } from "../controllers/auth.js";
const route = Router();

route.get("/login", login);
route.get("/logout", logout);

export default route;
